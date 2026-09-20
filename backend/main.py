from flask import request, jsonify, session
import os
from dotenv import load_dotenv
from config import app,db,mail
from models import User,Patient,Appointment,ToothRecord,AppointmentBalance,Notification
from datetime import datetime, date
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_mail import Message
import re

load_dotenv()

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
limiter = Limiter(app=app,key_func=get_remote_address)

# LOGIN ROUTES

@app.route("/verify_login", methods=["POST"])
@limiter.limit("10 per minute")
@limiter.limit("50 per day")
def verify_user():
    data = request.json

    if not data:
        return jsonify({"message" : "User not found!"}), 400
    
    if "user_name" not in data or "password" not in data:
        return jsonify({"message" : "Username and password are required"}), 400
    
    user = User.query.filter_by(user_name=data["user_name"]).first()

    if not user:
        return jsonify({"message" : "Invalid username"}), 401
    
    if user.password != data["password"]:
        return jsonify({"message" : "Invalid password"}), 401
    
    session["user_id"] = user.id
    
    return jsonify({
        "message" : "Login Sucessful",
        "user" : user.to_json()
    }),200


@app.route("/check_session", methods=["GET"])
def check_session():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"logged_in": False}), 401
    
    user = User.query.get(user_id)

    if not user:
        session.clear()
        return jsonify({"logged_in": False}), 401
    
    return jsonify({
        "logged_in": True,
        "user": user.to_json()
    }),200

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200


#PATIENT ROUTES
@app.route("/new_patients",methods=["POST"])
def new_patients():
    data = request.get_json()

    if (
        not data.get("name") or 
        not data.get("email") or
        not data.get("birthdate") or
        not data.get("age") or
        not data.get("gender") or
        not data.get("contact_num") or
        not data.get("address") or
        not data.get("weight") or
        not data.get("height") 
    ):
        return jsonify({"message" : "missing fields"})
    
    contact_num = str(data["contact_num"]).strip()

   
    if not re.fullmatch(r"\+?[\d\s\-()]+", contact_num):
        print("INVALID CONTACT NUMBER")
        return jsonify({"message": "contact num contains invalid characters"}), 400
    
    try:

        existing_patient = Patient.query.filter_by(
        name=data["name"],
        birthdate=data["birthdate"],
        email=data["email"]
         ).first()

        if existing_patient:
            return jsonify({
                "message": "You already have an appointment."
            }), 409
            
        new_patient = Patient(
            name = data["name"],
            email = data["email"],
            birthdate = data["birthdate"],
            age = data["age"],
            gender = data["gender"],
            contact_num = contact_num,
            address= data["address"],
            weight = data["weight"],
            height = data["height"]
        )
    

        db.session.add(new_patient)
        db.session.commit()

        return jsonify({
        "message" : "Patient Created",
        "patient" : new_patient.to_json()
    }), 201

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"error" : str(e)}), 500


@app.route("/get_patients", methods=["GET"])
def get_patients():
    patients = Patient.query.all()

    if not patients:
        return jsonify({"message" : "No Patients Available"}),404
    
    return jsonify({
        "patients" : [patient.to_json() for patient in patients]    
    }), 200

@app.route("/delete_patients/<int:id>", methods=["DELETE"])
def delete_patients(id):
    patient = db.session.get(Patient,id)

    if not patient:
        return jsonify({"message" : "Patient not found"}),404

    db.session.delete(patient)
    db.session.commit()

    return jsonify({"message" : "Patient deleted sucessfully"}),200

#SEARCH ROUTE

@app.route("/search_patients", methods=["GET"])
def search_patients():
    query = request.args.get("q", "")

    appointments = (
        Appointment.query
        .join(Patient)
        .filter(Patient.name.ilike(f"%{query}%"))
        .all()
    )

    return jsonify(
        [appointment.to_json() for appointment in appointments]
    ), 200

#TIMESLOT ROUTES
@app.route("/get_todays_appointments", methods=["GET"])
def get_todays_appointments():
    today = date.today()

    appointments = (
        Appointment.query
        .filter(
            Appointment.appointment_date == today,
            Appointment.status == "Confirmed"  
        )
        .order_by(Appointment.appointment_time.asc())
        .all()
    )

    return jsonify({
        "appointments": [appointment.to_json() for appointment in appointments],
        "total": len(appointments)
    }), 200

@app.route("/get_taken_times/<appointment_date>", methods=["GET"])
def get_taken_times(appointment_date):
    appointments = Appointment.query.filter(
        Appointment.appointment_date == appointment_date,
        Appointment.status.in_(["Pending", "Confirmed"])
    ).all()

    return jsonify({
        "taken_times": [
            appointment.appointment_time.strftime("%H:%M")
            for appointment in appointments
        ]
    }), 200


#APPOINTMENT ROUTES

@app.route("/new_appointment", methods=["POST"])
def new_appointment():
    data = request.get_json()

    if (
        not data.get("patient_id") or
        not data.get("appointment_date") or
        not data.get("appointment_time") or
        not data.get("reason_for_visit") or
        not data.get("status")
    ):
        return jsonify({"message": "Fields missing"}), 400
    
    patient = Patient.query.get(data["patient_id"])

    if not patient:
        return jsonify({"message" : "Patient not found"}),404
    
    try:
        appointment_date = datetime.strptime(
            data["appointment_date"], "%Y-%m-%d"
        ).date()

        appointment_time = datetime.strptime(
            data["appointment_time"], "%H:%M"
        ).time()
    except ValueError:
        return jsonify({"message" : "Invalid date or time format."}), 400
    
    existing = Appointment.query.filter(
    Appointment.appointment_date == appointment_date,
    Appointment.appointment_time == appointment_time,
    Appointment.status.in_(["Pending", "Confirmed"])
    ).first()

    if existing:
        return jsonify({
            "message": "This time slot is already booked."
        }), 409
    
    new_appointment = Appointment(
        patient_id = data["patient_id"],
        appointment_date = appointment_date,
        appointment_time = appointment_time,
        reason_for_visit = data["reason_for_visit"],
        status = data["status"]
    )


    db.session.add(new_appointment)
    db.session.commit()
    

    notification = Notification(
        message=f"{patient.name} requested an appointment.",
        notification_type="appointment",
    appointment_id=new_appointment.id,
    is_read=False
    )
    
    db.session.add(notification)
    db.session.commit()

    return jsonify({
        "message" : "Appointment Created",
        "appointment" : new_appointment.to_json()
    }),201

@app.route("/delete_appointment/<int:id>", methods=["DELETE"])
def delete_appointment(id):
    appointment =  db.session.get(Appointment,id)

    if not appointment:
        return jsonify({"message" : "Appointment not found!"}),404
    

    db.session.delete(appointment)
    db.session.commit()
    
    return jsonify({"message" : "Appointment deleted succesfully"}),200


@app.route("/get_appointments", methods=["GET"])
def get_appointments():
    patient = request.args.get("patient", "").strip()

    query = Appointment.query.join(Patient)

    if patient:
        query = query.filter(Patient.name.ilike(f"%{patient}%"))

    appointments = query.order_by(
        Appointment.appointment_date.asc(),
        Appointment.appointment_time.asc()
    ).all()

    return jsonify({
        "appointments": [appointment.to_json() for appointment in appointments],
        "appointment_total": len(appointments)
    }), 200


@app.route("/confirm_appointment/<int:id>", methods=["PATCH"])
def confirm_appointment(id):
    appointment = db.session.get( Appointment,id)

    if not appointment:
        return jsonify({"message" : "Appointment not found"}), 404
    
    
    if appointment.status != "Pending":
        return jsonify({
            "message": "Appointment has already been processed."
        }), 400
        
    appointment.status = "Confirmed"

    db.session.commit()

    return jsonify({
        "message" : "Appointment confirmed"
    }),200

@app.route("/get_confirmed_appointments", methods=["GET"])
def get_confirmed_appointments():
    confirmed_appointments = Appointment.query.filter_by(status="Confirmed").all()

    if not confirmed_appointments:
        return jsonify({"message": "No confirmed appointments found!"}), 404
    
    confirmed_count = len(confirmed_appointments)

    return jsonify({
        "confirmed_appointments": [confirmed_appointment.to_json() for confirmed_appointment in confirmed_appointments],
        "appointment_count" : confirmed_count
    }), 200

@app.route("/get_pending_appointments", methods=["GET"])
def get_pending_appointments():
    pending_appointments = Appointment.query.filter_by(status="Pending").all()

    return jsonify({
        "pending_appointments": [
            appointment.to_json()
            for appointment in pending_appointments
        ],
        "pending_count": len(pending_appointments)
    }), 200

@app.route("/decline_appointments/<int:id>", methods=["PATCH"])
def decline_appointments(id):
    appointment = db.session.get(Appointment,id)

    if not appointment:
        return jsonify({"message" : "Appointment not found"}), 404
    
    if appointment.status != "Pending":
        return jsonify({
            "message": "Appointment has already been processed."
        }), 400
    
    appointment.status = "Declined"

    db.session.commit()

    return jsonify({
        "message" : "Appointment Declined Successfully"
    }),200

@app.route("/get_declined_appointments", methods=["GET"])
def get_declined_appointments():
    declined_appointments = Appointment.query.filter_by(status="Declined").all()

    return jsonify({
        "declined_appointment": [
            appointment.to_json() for appointment in declined_appointments
        ],
        "declined_count": len(declined_appointments)
    }), 200

#TEETH ROUTE

@app.route("/get_tooth_record/<int:patient_id>", methods=["GET"])
def get_tooth_record(patient_id):
    patient = Patient.query.get(patient_id)

    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    tooth_records = ToothRecord.query.filter_by(
        patient_id=patient_id
    ).all()

    return jsonify({
        "tooth_records": [record.to_json() for record in tooth_records]
    }), 200

@app.route("/get_tooth_record/<int:patient_id>/<int:tooth_number>", methods=["GET"])
def get_single_tooth_record(patient_id, tooth_number):
    record = ToothRecord.query.filter_by(
        patient_id=patient_id,
        tooth_number=tooth_number
    ).first()

    if not record:
        return jsonify({"record": None}), 200

    return jsonify({
        "record": record.to_json()
    }), 200

@app.route("/add_tooth_record", methods=["POST"])
def add_teeth_record():
    data = request.get_json()

    if ( data.get("patient_id") is None or
    data.get("tooth_number") is None or
    not data.get("condition") or
    not data.get("treatment") or
    not data.get("notes")):

        return jsonify({"message" : "missing fields"}), 404

    patient = Patient.query.get(data["patient_id"])

    if not patient:
        return jsonify({"message" : "patient not found"}),404

    existing = ToothRecord.query.filter_by(
        patient_id=data["patient_id"],
        tooth_number=data["tooth_number"]
    ).first()

    if existing:
        return jsonify({
            "message": "This tooth already has a record."
        }), 409

    try: 
        new_record = ToothRecord(
            patient_id = data["patient_id"],
            tooth_number = data["tooth_number"],
            condition = data["condition"],
            treatment = data["treatment"],
            notes = data["notes"],
        )

        db.session.add(new_record)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        return jsonify({"error" : str(e)})

    return jsonify({
        "message" : "Tooth record created succesfully!",
        "new_record" : new_record.to_json()
    }),201

@app.route("/update_tooth_record/<int:record_id>", methods=["PATCH"])
def update_tooth_record(record_id):
    record = ToothRecord.query.get(record_id)

    if not record:
        return jsonify({"message" : "Tooth record not found"}), 404

    data = request.get_json()

    if "condition" in data:
        record.condition = data["condition"]

    if "treatment" in data:
        record.treatment = data["treatment"]

    if "notes" in data:
        record.notes = data["notes"]

    try:
        db.session.commit()

        return jsonify({
            "message": "Tooth record updated successfully!",
            "record": record.to_json()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/delete_tooth_record/<int:id>", methods=["DELETE"])
def delete_tooth_records(id):
    tooth_records = ToothRecord.query.get(id)

    if not tooth_records:
        return jsonify({"message" : "no records found"}),404

    db.session.delete(tooth_records)
    db.session.commit()

    return jsonify({"message" : "record successfully deleted!"}),200


#PATIENT DOCUMENTS ROUTE

@app.route("/get_appointment_balance/<int:patient_id>", methods=["GET"])
def get_appointment_balance(patient_id):

    appointment_balance = AppointmentBalance.query.filter_by(
        patient_id=patient_id
    ).first()

    if not appointment_balance:
        return jsonify({
            "message": "Appointment balance not found"
        }), 404

    return jsonify(
        appointment_balance.to_json()
    ), 200

@app.route("/update_main_balance/<int:patient_id>", methods=["PATCH"])
def update_main_balance(patient_id):

    data = request.get_json()

    if not data or "balance" not in data:
        return jsonify({
            "message": "Balance is required"
        }), 400

    try:
        balance = float(data["balance"])

        if balance < 0:
            return jsonify({
                "message": "Balance cannot be negative"
            }), 400

    except (ValueError, TypeError):
        return jsonify({
            "message": "Invalid balance"
        }), 400

    appointment_balance = AppointmentBalance.query.filter_by(
        patient_id=patient_id
    ).first()

    if not appointment_balance:

        appointment_balance = AppointmentBalance(
            patient_id=patient_id,
            balance=balance,
            next_balance=0.0,
            isPaid="unpaid"
        )

        db.session.add(appointment_balance)

    else:
        appointment_balance.balance = balance

    db.session.commit()

    return jsonify({
        "message": "Main balance updated successfully",
        "appointment_balance": appointment_balance.to_json()
    }), 200

@app.route("/update_next_appointment/<int:patient_id>", methods=["PATCH"])
def update_next_appointment(patient_id):

    data = request.get_json()

    required_fields = [
        "next_appointment_date",
        "next_appointment_time",
        "next_balance"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "message": f"{field} is required"
            }), 400

    try:
        appointment_date = datetime.strptime(
            data["next_appointment_date"],
            "%Y-%m-%d"
        ).date()

        appointment_time = datetime.strptime(
            data["next_appointment_time"],
            "%H:%M"
        ).time()

        next_balance = float(data["next_balance"])

        if next_balance < 0:
            return jsonify({
                "message": "Next balance cannot be negative"
            }), 400

    except (ValueError, TypeError):
        return jsonify({
            "message": "Invalid date, time, or balance"
        }), 400

    appointment_balance = AppointmentBalance.query.filter_by(
        patient_id=patient_id
    ).first()

    if not appointment_balance:

        appointment_balance = AppointmentBalance(
            patient_id=patient_id,
            next_appointment_date=appointment_date,
            next_appointment_time=appointment_time,
            balance=0.0,
            next_balance=next_balance,
            isPaid="unpaid"
        )

        db.session.add(appointment_balance)

    else:

        appointment_balance.next_appointment_date = appointment_date
        appointment_balance.next_appointment_time = appointment_time
        appointment_balance.next_balance = next_balance

        # New appointment means payment is unpaid again
        appointment_balance.isPaid = "unpaid"

    db.session.commit()

    return jsonify({
        "message": "Next appointment updated successfully",
        "appointment_balance": appointment_balance.to_json()
    }), 200

@app.route("/pay_next_appointment/<int:patient_id>", methods=["PATCH"])
def pay_next_appointment(patient_id):

    appointment_balance = AppointmentBalance.query.filter_by(
        patient_id=patient_id
    ).first()

    if not appointment_balance:
        return jsonify({
            "message": "Appointment balance not found"
        }), 404

    if appointment_balance.isPaid == "paid":
        return jsonify({
            "message": "Next appointment has already been paid"
        }), 400

    if appointment_balance.next_balance <= 0:
        return jsonify({
            "message": "There is no balance to pay"
        }), 400

    if appointment_balance.balance < appointment_balance.next_balance:
        return jsonify({
            "message": "Main balance is lower than the next appointment balance"
        }), 400

    appointment_balance.balance -= appointment_balance.next_balance

    appointment_balance.isPaid = "paid"

    db.session.commit()

    return jsonify({
        "message": "Next appointment marked as paid",
        "appointment_balance": appointment_balance.to_json()
    }), 200

# NOTIFICATION ROUTES

@app.route("/get_notifications", methods=["GET"])
def get_notifications():

    notifications = Notification.query.order_by(
        Notification.created_at.desc()
    ).all()

    unread_count = Notification.query.filter_by(
        is_read=False
    ).count()

    return jsonify({
        "notifications": [
            notification.to_json()
            for notification in notifications
        ],
        "unread_count": unread_count
    }), 200
    

@app.route("/read_notification/<int:id>", methods=["PATCH"])
def read_notification(id):

    notification = db.session.get(Notification, id)

    if not notification:
        return jsonify({
            "message": "Notification not found"
        }), 404

    notification.is_read = True

    db.session.commit()

    return jsonify({
        "message": "Notification marked as read",
        "notification": notification.to_json()
    }), 200


@app.route("/read_all_notifications", methods=["PATCH"])
def read_all_notifications():

    notifications = Notification.query.filter_by(
        is_read=False
    ).all()

    for notification in notifications:
        notification.is_read = True

    db.session.commit()

    return jsonify({
        "message": "All notifications marked as read"
    }), 200
    

@app.route("/delete_notification/<int:id>", methods=["DELETE"])
def delete_notification(id):

    notification = db.session.get(Notification, id)

    if not notification:
        return jsonify({
            "message": "Notification not found"
        }), 404

    db.session.delete(notification)
    db.session.commit()

    return jsonify({
        "message": "Notification deleted successfully"
    }), 200
    

@app.route("/delete_all_notifications", methods=["DELETE"])
def delete_all_notifications():

    Notification.query.delete()

    db.session.commit()

    return jsonify({
        "message": "All notifications deleted successfully"
    }), 200



#MAIL ROUTE

@app.route("/send_reminder_mail", methods=["POST"])
def send_reminder_mail():
    data = request.get_json()

    patient = db.session.get(Patient, data["patient_id"])

    appointment = db.session.get(Appointment, data["appointment_id"])

    if not appointment:
        return jsonify({"message" : "No confirmed appointments found"}),404
    
    msg = Message(
        subject="Appointment Reminder",
        sender=app.config["MAIL_USERNAME"],
        recipients=[patient.email]
    )
    
    msg.body = f"""Dear {patient.name},

    This is a friendly reminder that you have an upcoming appointment with Swiss Dental Clinic.

    Appointment Details

    Date: {appointment.appointment_date.strftime("%Y-%m-%d")}
    Time: {appointment.appointment_time.strftime("%I:%M %p")}
    Reason for Visit: {appointment.reason_for_visit}

    Please arrive 10–15 minutes before your scheduled appointment to ensure a smooth check-in process.

    If you are unable to attend or need to reschedule, please let us know as soon as possible so we can accommodate other patients.

    We look forward to seeing you and providing you with excellent dental care.

    Thank you for choosing Swiss Dental Clinic.

    Kind regards,

    Swiss Dental Clinic
    📍 Ledesma Bldg 11 Jordan Street, Parañaque, Philippines, 1719
    📞 (02) 828 4130
    📧 analizaborras@yahoo.com
    """

    mail.send(msg)
    return("Reminder mail sent sucessfully")

@app.route("/send_mail", methods=["POST"])
def send_mail():
    data = request.get_json()
    
    patient = db.session.get(Patient, data["patient_id"])
   

    appointment = Appointment.query.filter_by(
        patient_id=patient.id
    ).order_by(Appointment.id.desc()).first()

    msg = Message(
        subject="Appointment Confirmed!",
        sender=app.config["MAIL_USERNAME"],
        recipients=[patient.email]
    )
    msg.body = f""" Dear {patient.name},

    Thank you for choosing Swiss Dental Clinic.

    Your appointment has been successfully confirmed. Please find the details below:

    Appointment Details

    Patient Name: {patient.name}
    Date: {appointment.appointment_date}
    Time: {appointment.appointment_time}
    Reason for Visit: {appointment.reason_for_visit}

    Please arrive 10–15 minutes before your scheduled appointment to allow time for check-in and any necessary paperwork.

    If you need to reschedule or cancel your appointment, please contact us as soon as possible so we can assist you.

    We look forward to providing you with the best possible dental care.

    Kind regards,

    Swiss Dental Clinic
    📍  Ledesma Bldg 11 Jordan Street, Parañaque, Philippines, 1719
    📞 (02) 828 4130
    📧 analizaborras@yahoo.com
    """

    mail.send(msg)

    return {"message" : "Email sent succesfully"}

@app.route("/send_declined_email", methods=["POST"])
def send_declined_email():
    data = request.get_json()

    patient = db.session.get(Patient, data["patient_id"])

    appointment = Appointment.query.filter_by(
        patient_id=patient.id
    ).order_by(Appointment.id.desc()).first()

    msg = Message(
        subject="Appointment Request Update!",
        sender=app.config["MAIL_USERNAME"],
        recipients=[patient.email]
    )

    msg.body = f""" Dear {patient.name},

    Thank you for choosing Swiss Dental Clinic.

    We regret to inform you that your appointment request scheduled for {appointment.appointment_date} at {appointment.appointment_time} has been declined.

    This may be due to scheduling conflicts or limited appointment availability. We sincerely apologize for any inconvenience this may cause.

    If you would still like to book an appointment, we encourage you to submit a new appointment request with a different preferred date or time. We would be happy to accommodate you whenever possible.

    If you have any questions or need assistance, please don't hesitate to contact us.

    Thank you for your understanding, and we look forward to serving you in the future.

    Kind regards,

    Swiss Dental Clinic
    """

    mail.send(msg)

    return {"message" : "Email sent succesfully"}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)