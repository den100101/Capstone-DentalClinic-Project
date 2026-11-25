from flask import request, jsonify, session
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
import os
from dotenv import load_dotenv
from config import app,db,mail
from models import User,Patient,Appointment,ToothRecord,AppointmentBalance,Notification,Payment,PatientSignature
from datetime import datetime, date, timedelta
from werkzeug.security import check_password_hash
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_mail import Message
from sqlalchemy import inspect, text
import re

load_dotenv()

# config.py validates SECRET_KEY and configures the session cookie and CORS.
limiter = Limiter(app=app,key_func=get_remote_address)

booking_serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
BOOKING_TOKEN_SALT = "swiss-public-appointment-booking"

# Only these endpoints are intentionally available without an admin session.
PUBLIC_ENDPOINTS = {
    "verify_user",
    "check_session",
    "logout",
    "new_patients",
    "new_appointment",
    "get_taken_times",
    "send_mail",  # Public contact form.
}

@app.before_request
def protect_admin_api_and_check_request_origin():
    # A credentialed browser request must originate from the configured frontend.
    if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
        origin = request.headers.get("Origin")
        allowed_origins = app.config.get("CORS_ORIGINS", [])
        if origin not in allowed_origins:
            return jsonify({"message": "Request origin is not allowed."}), 403

    if request.endpoint is None or request.endpoint in PUBLIC_ENDPOINTS:
        return None

    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"message": "Authentication required."}), 401

    user = db.session.get(User, user_id)
    if user is None:
        session.clear()
        return jsonify({"message": "Authentication required."}), 401

    return None

def issue_booking_token(patient_id):
    return booking_serializer.dumps(
        {"patient_id": patient_id},
        salt=BOOKING_TOKEN_SALT
    )

def resolve_booking_token(token):
    payload = booking_serializer.loads(
        token,
        salt=BOOKING_TOKEN_SALT,
        max_age=900
    )
    return payload.get("patient_id")

# LOGIN ROUTES

@app.route("/verify_login", methods=["POST"])
@limiter.limit("10 per minute")
@limiter.limit("50 per day")
def verify_user():
    data = request.get_json()

    if not data:
        return jsonify({"message": "User not found!"}), 400

    if "user_name" not in data or "password" not in data:
        return jsonify({
            "message": "Username and password are required"
        }), 400

    user = User.query.filter_by(
        user_name=data["user_name"]
    ).first()

    if not user:
        return jsonify({"message": "Invalid username"}), 401

    if not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid password"}), 401

    session.clear()
    session["user_id"] = user.id
    session.permanent = True

    return jsonify({
        "message": "Login Successful",
        "user": user.to_json()
    }), 200

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

@app.route("/new_patients", methods=["POST"])
def new_patients():
    data = request.get_json(silent=True) or {}

    required_fields = [
        "name", "email", "birthdate", "age", "gender",
        "contact_num", "address", "weight", "height"
    ]

    missing_fields = [
        field for field in required_fields
        if data.get(field) is None or str(data.get(field)).strip() == ""
    ]

    if missing_fields:
        return jsonify({
            "message": "Please complete all required patient fields.",
            "missing_fields": missing_fields
        }), 400

    name = " ".join(str(data["name"]).strip().split())
    email = str(data["email"]).strip()
    contact_num = str(data["contact_num"]).strip()

    if not re.fullmatch(r"\+?[\d\s\-()]+", contact_num):
        return jsonify({
            "message": "Contact number contains invalid characters."
        }), 400

    normalized_contact = re.sub(r"\D", "", contact_num)
    normalized_name = name.casefold()

    if not normalized_contact:
        return jsonify({
            "message": "Please provide a valid contact number."
        }), 400

    try:
        birthdate = datetime.strptime(
            str(data["birthdate"]), "%Y-%m-%d"
        ).date()
        
        possible_duplicates = Patient.query.filter(
            db.func.lower(db.func.trim(Patient.name)) == normalized_name
        ).all()

        existing_patient = next(
            (
                patient for patient in possible_duplicates
                if re.sub(r"\D", "", str(patient.contact_num or ""))
                == normalized_contact
            ),
            None
        )

        if existing_patient:
            return jsonify({
                "message": (
                    "This patient is already registered. "
                    "Please proceed using the existing patient record."
                ),
                "booking_token": issue_booking_token(existing_patient.id),
                "existing_patient": True
            }), 200

        new_patient = Patient(
            name=name,
            email=email,
            birthdate=birthdate,
            age=data["age"],
            gender=data["gender"],
            contact_num=contact_num,
            address=data["address"],
            weight=data["weight"],
            height=data["height"]
        )

        db.session.add(new_patient)
        db.session.commit()

        return jsonify({
            "message": "Patient created successfully.",
            "booking_token": issue_booking_token(new_patient.id),
            "existing_patient": False
        }), 201

    except ValueError:
        db.session.rollback()
        return jsonify({
            "message": "Invalid birthdate. Use YYYY-MM-DD."
        }), 400

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to register patient")
        return jsonify({
            "message": "Failed to register patient."
        }), 500



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
            Appointment.status.in_(["Confirmed", "Completed"])
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
        Appointment.status.in_(["Pending", "Confirmed", "Completed"])
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
    data = request.get_json(silent=True) or {}

    required_fields = [
        "booking_token",
        "appointment_date",
        "appointment_time",
        "reason_for_visit"
    ]

    if any(
        data.get(field) is None or str(data.get(field)).strip() == ""
        for field in required_fields
    ):
        return jsonify({
            "message": "Patient, date, time, and reason are required."
        }), 400

    try:
        patient_id = resolve_booking_token(str(data["booking_token"]))
    except (BadSignature, SignatureExpired, TypeError, AttributeError):
        return jsonify({
            "message": "Your registration session expired. Please submit the patient form again."
        }), 400

    if not isinstance(patient_id, int):
        return jsonify({"message": "Invalid appointment registration token."}), 400

    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({"message": "Patient not found."}), 404

    try:
        appointment_date = datetime.strptime(
            str(data["appointment_date"]), "%Y-%m-%d"
        ).date()

        appointment_time = datetime.strptime(
            str(data["appointment_time"]), "%H:%M"
        ).time()

    except (ValueError, TypeError):
        return jsonify({
            "message": "Invalid appointment date or time."
        }), 400

    reason = str(data["reason_for_visit"]).strip()

    if len(reason) > 80:
        return jsonify({
            "message": "Reason for visit cannot exceed 80 characters."
        }), 400

    # Public registration must create a Pending request.
    status = "Pending"

    try:
        # Prevent duplicate active bookings for the same slot.
        existing = Appointment.query.filter(
            Appointment.appointment_date == appointment_date,
            Appointment.appointment_time == appointment_time,
            Appointment.status.in_(["Pending", "Confirmed", "Completed"])
        ).first()

        if existing:
            return jsonify({
                "message": "This time slot is already booked."
            }), 409

        appointment = Appointment(
            patient_id=patient.id,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            reason_for_visit=reason,
            status=status
        )

        db.session.add(appointment)
        db.session.flush()

        notification = Notification(
            message=f"{patient.name} requested an appointment.",
            notification_type="appointment",
            appointment_id=appointment.id,
            is_read=False
        )

        db.session.add(notification)
        db.session.commit()

        return jsonify({
            "message": "Appointment request submitted successfully.",
            "appointment": appointment.to_json()
        }), 201

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to create appointment")
        return jsonify({
            "message": "Failed to submit appointment request."
        }), 500



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
    patient_id = request.args.get("patient_id", type=int)
    patient_name = request.args.get("patient", "").strip()

    query = Appointment.query

    if patient_id is not None:
        query = query.filter(Appointment.patient_id == patient_id)

    elif patient_name:
        query = query.join(Patient).filter(
            Patient.name.ilike(f"%{patient_name}%")
        )

    appointments = query.order_by(
        Appointment.appointment_date.asc(),
        Appointment.appointment_time.asc()
    ).all()

    # What was paid at each visit, for the Payment column in Appointment History.
    paid_by_appointment = {
        appointment_id: float(total)
        for appointment_id, total in (
            db.session.query(
                Payment.appointment_id,
                db.func.sum(Payment.amount)
            )
            .filter(
                Payment.appointment_id.in_(
                    [appointment.id for appointment in appointments]
                )
            )
            .group_by(Payment.appointment_id)
            .all()
        )
    }

    return jsonify({
        "appointments": [
            {
                **appointment.to_json(),
                "payment_amount": paid_by_appointment.get(appointment.id)
            }
            for appointment in appointments
        ],
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
    

@app.route(
    "/update_required_payment_before_signing/<int:patient_id>",
    methods=["PATCH"]
)
def update_required_payment_before_signing(patient_id):
    data = request.get_json()

    if not data or "required_payment_before_signing" not in data:
        return jsonify({
            "message": "Required payment amount is missing"
        }), 400

    try:
        amount = float(data["required_payment_before_signing"])

        if not __import__("math").isfinite(amount) or amount < 0:
            return jsonify({
                "message": "Amount must be a valid non-negative number"
            }), 400

        amount = round(amount, 2)

    except (ValueError, TypeError):
        return jsonify({
            "message": "Invalid payment amount"
        }), 400

    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({
            "message": "Patient not found"
        }), 404

    appointment_balance = AppointmentBalance.query.filter_by(
        patient_id=patient_id
    ).first()

    if not appointment_balance:
        appointment_balance = AppointmentBalance(
            patient_id=patient_id,
            balance=0.0,
            next_balance=0.0,
            estimated_treatment_cost=0.0,
            required_payment_before_signing=amount,
            isPaid="unpaid"
        )
        db.session.add(appointment_balance)
    else:
        appointment_balance.required_payment_before_signing = amount

    # A newly set visit payment stays unpaid until the patient signs.
    if amount > 0:
        appointment_balance.isPaid = "unpaid"

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to update signing payment requirement")
        return jsonify({
            "message": "Failed to update required payment"
        }), 500

    return jsonify({
        "message": "Required payment before signing updated successfully",
        "required_payment_before_signing":
            appointment_balance.required_payment_before_signing
    }), 200


@app.route("/update_estimated_treatment_cost/<int:patient_id>", methods=["PATCH"])
def update_estimated_treatment_cost(patient_id):

    data = request.get_json()

    if not data or "estimated_treatment_cost" not in data:
        return jsonify({
            "message": "Estimated treatment cost is required"
        }), 400

    try:
        estimated_treatment_cost = float(
            data["estimated_treatment_cost"]
        )

        if estimated_treatment_cost < 0:
            return jsonify({
                "message": "Estimated treatment cost cannot be negative"
            }), 400

    except (ValueError, TypeError):
        return jsonify({
            "message": "Invalid estimated treatment cost"
        }), 400

    appointment_balance = AppointmentBalance.query.filter_by(
        patient_id=patient_id
    ).first()

    if not appointment_balance:
        appointment_balance = AppointmentBalance(
            patient_id=patient_id,
            balance=0.0,
            next_balance=0.0,
            estimated_treatment_cost=estimated_treatment_cost,
            isPaid="unpaid"
        )

        db.session.add(appointment_balance)

    else:
        appointment_balance.estimated_treatment_cost = estimated_treatment_cost

    db.session.commit()

    return jsonify({
        "message": "Estimated treatment cost updated successfully",
        "appointment_balance": appointment_balance.to_json()
    }), 200
    
    


@app.route("/get_patient_budget/<int:patient_id>", methods=["GET"])
def get_patient_budget(patient_id):
    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    appointment_balance = AppointmentBalance.query.filter_by(
        patient_id=patient_id
    ).first()

    if not appointment_balance:
        return jsonify({
            "balance": 0,
            "total_paid": 0,
            "remaining": 0,
            "required_payment": 0,
            "required_payment_before_signing": 0,
            "signing_payment_satisfied": False,
            "payments": []
        }), 200

    payments = Payment.query.filter_by(
        patient_id=patient_id
    ).order_by(Payment.payment_date.desc()).all()

    total_paid = sum(
        float(payment.amount or 0)
        for payment in payments
    )

    balance = float(appointment_balance.balance or 0)
    required_payment = float(
        appointment_balance.required_payment_before_signing or 0
    )

    return jsonify({
        "balance": balance,
        "total_paid": round(total_paid, 2),
        "remaining": balance,
        "required_payment": required_payment,
        "required_payment_before_signing": required_payment,
        "signing_payment_satisfied": total_paid >= required_payment,
        "payments": [
            {
                "id": payment.id,
                "amount": payment.amount,
                "payment_date": (
                    payment.payment_date.isoformat()
                    if payment.payment_date else None
                )
            }
            for payment in payments
        ]
    }), 200


@app.route("/update_next_appointment/<int:patient_id>", methods=["PATCH"])
def update_next_appointment(patient_id):
    data = request.get_json(silent=True) or {}

    patient = db.session.get(Patient, patient_id)
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

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
            data["next_appointment_date"], "%Y-%m-%d"
        ).date()

        appointment_time = datetime.strptime(
            data["next_appointment_time"], "%H:%M"
        ).time()

        next_balance = float(data["next_balance"])

        if not __import__("math").isfinite(next_balance) or next_balance < 0:
            return jsonify({
                "message": "Next balance must be a valid non-negative amount"
            }), 400

        next_balance = round(next_balance, 2)

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
            required_payment_before_signing=0.0,
            isPaid="unpaid"
        )
        db.session.add(appointment_balance)
    else:
        appointment_balance.next_appointment_date = appointment_date
        appointment_balance.next_appointment_time = appointment_time
        appointment_balance.next_balance = next_balance
        appointment_balance.isPaid = "unpaid"

    try:
        db.session.commit()
        return jsonify({
            "message": "Next appointment updated successfully",
            "appointment_balance": appointment_balance.to_json()
        }), 200
    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to update next appointment")
        return jsonify({
            "message": "Failed to update next appointment"
        }), 500



@app.route("/get_monthly_revenue", methods=["GET"])
def get_monthly_revenue():
    today = datetime.now()

    start_of_month = datetime(today.year, today.month, 1)

    if today.month == 12:
        start_of_next_month = datetime(today.year + 1, 1, 1)
    else:
        start_of_next_month = datetime(
            today.year,
            today.month + 1,
            1
        )

    revenue = db.session.query(
        db.func.sum(Payment.amount)
    ).filter(
        Payment.payment_date >= start_of_month,
        Payment.payment_date < start_of_next_month
    ).scalar()

    return jsonify({
        "monthly_revenue": revenue or 0
    }), 200
    
@app.route("/save_patient_signature/<int:patient_id>", methods=["POST"])
def save_patient_signature(patient_id):
    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({
            "message": "Patient not found"
        }), 404

    data = request.get_json(silent=True) or {}
    signature = data.get("signature")

    if not signature:
        return jsonify({
            "message": "Signature is required"
        }), 400

    try:
        new_signature = PatientSignature(
            patient_id=patient_id,
            signature=signature
        )

        db.session.add(new_signature)
        db.session.commit()

        return jsonify({
            "message": "Patient signature saved successfully",
            "signature_id": new_signature.id
        }), 201

    except Exception:
        db.session.rollback()

        app.logger.exception(
            "Failed to save patient signature for patient %s",
            patient_id
        )

        return jsonify({
            "message": "Failed to save patient signature"
        }), 500



@app.route(
    "/sign_and_complete_appointment/<int:patient_id>",
    methods=["POST"]
)
def sign_and_complete_appointment(patient_id):
    data = request.get_json(silent=True) or {}
    signature = data.get("signature")

    if not signature:
        return jsonify({"message": "Signature is required."}), 400

    try:
        appointment_id = int(data.get("appointment_id"))
    except (ValueError, TypeError):
        return jsonify({
            "message": "Please select the appointment to complete."
        }), 400

    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({"message": "Patient not found."}), 404

    try:
        # Complete the exact appointment the frontend selected.
        appointment = (
            Appointment.query
            .filter_by(id=appointment_id, patient_id=patient_id)
            .with_for_update()
            .first()
        )

        if not appointment:
            return jsonify({
                "message": "Appointment not found for this patient."
            }), 404

        # The clinic confirms the appointment in Pending Appointments first.
        if appointment.status != "Confirmed":
            return jsonify({
                "message": (
                    "Only appointments confirmed by the clinic can be "
                    "signed. This appointment is "
                    f"{appointment.status.lower()}."
                )
            }), 409

        appointment_balance = (
            AppointmentBalance.query
            .filter_by(patient_id=patient_id)
            .with_for_update()
            .first()
        )

        if not appointment_balance:
            return jsonify({
                "message": (
                    "Patient budget was not found. "
                    "Please set up the patient's budget first."
                )
            }), 404

        main_balance = round(float(appointment_balance.balance or 0), 2)

        # The payment the admin set for this visit.
        amount_due = round(
            float(appointment_balance.required_payment_before_signing or 0),
            2
        )

        if amount_due <= 0:
            return jsonify({
                "message": (
                    "Set the payment for this visit in Required Payment "
                    "Before Signing before the patient signs."
                )
            }), 400

        if amount_due > main_balance:
            return jsonify({
                "message": (
                    f"The payment for this visit (₱{amount_due:,.2f}) is "
                    f"more than the main balance (₱{main_balance:,.2f})."
                )
            }), 400

        payment = Payment(
            patient_id=patient_id,
            appointment_id=appointment.id,
            amount=amount_due
        )
        db.session.add(payment)

        # Take this visit's payment off the main balance. The admin sets
        # the payment again for the next visit.
        appointment_balance.balance = round(main_balance - amount_due, 2)
        appointment_balance.required_payment_before_signing = 0.0
        appointment_balance.isPaid = "paid"

        appointment.status = "Completed"

        # Save the signature and notification in the same transaction.
        new_signature = PatientSignature(
            patient_id=patient_id,
            signature=signature
        )
        db.session.add(new_signature)
        db.session.flush()

        notification = Notification(
            message=(
                f"{patient.name} signed and paid ₱{amount_due:,.2f}."
            ),
            notification_type="appointment",
            appointment_id=appointment.id,
            is_read=False
        )
        db.session.add(notification)

        db.session.commit()

        return jsonify({
            "message": "Signature saved, payment recorded, and appointment completed.",
            "signature_id": new_signature.id,
            "payment_id": payment.id,
            "amount_paid": amount_due,
            "appointment": appointment.to_json(),
            "appointment_balance": appointment_balance.to_json()
        }), 200

    except Exception:
        db.session.rollback()
        app.logger.exception(
            "Failed to sign and complete appointment for patient %s",
            patient_id
        )
        return jsonify({
            "message": (
                "Unable to save the signature and record the payment."
            )
        }), 500


#NOTIFICATION ROUTES
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



# DAILY REPORT ROUTE

@app.route("/get_daily_report", methods=["GET"])
def get_daily_report():
    selected_date = request.args.get("date")

    if not selected_date:
        report_date = (
            datetime.utcnow() + timedelta(hours=8)
        ).date()
    else:
        try:
            report_date = datetime.strptime(
                selected_date, "%Y-%m-%d"
            ).date()
        except ValueError:
            return jsonify({
                "message": "Invalid date. Use YYYY-MM-DD."
            }), 400

    start_utc = datetime.combine(
        report_date, datetime.min.time()
    ) - timedelta(hours=8)

    end_utc = start_utc + timedelta(days=1)
    new_patients = Patient.query.filter(
        Patient.created_at >= start_utc,
        Patient.created_at < end_utc
    ).order_by(
        Patient.created_at.asc()
    ).all()
    
    appointments = Appointment.query.filter_by(
        appointment_date=report_date
    ).order_by(
        Appointment.appointment_time.asc()
    ).all()

    pending_count = sum(
        1 for appointment in appointments
        if appointment.status == "Pending"
    )

    confirmed_count = sum(
        1 for appointment in appointments
        if appointment.status == "Confirmed"
    )

    declined_count = sum(
        1 for appointment in appointments
        if appointment.status == "Declined"
    )

    completed_count = sum(
        1 for appointment in appointments
        if appointment.status == "Completed"
    )

    payments = Payment.query.filter(
        Payment.payment_date >= start_utc,
        Payment.payment_date < end_utc
    ).order_by(
        Payment.payment_date.asc()
    ).all()

    total_revenue = sum(
        payment.amount for payment in payments
    )

    
    return jsonify({
        "report_date": report_date.isoformat(),

        "new_patients": {
            "total": len(new_patients),
            "details": [
                {
                    "id": patient.id,
                    "name": patient.name,
                    "email": patient.email,
                    "created_at": (
                        patient.created_at.isoformat()
                        if patient.created_at
                        else None
                    )
                }
                for patient in new_patients
            ]
        },

        "appointments": {
            "total": len(appointments),
            "pending": pending_count,
            "confirmed": confirmed_count,
            "declined": declined_count,
            "completed": completed_count,
            "details": [
                appointment.to_json()
                for appointment in appointments
            ]
        },

        "payments": {
            "transaction_count": len(payments),
            "total_revenue": round(total_revenue, 2),
            "details": [
                {
                    "payment_id": payment.id,
                    "patient_id": payment.patient_id,
                    "patient_name": payment.patient.name,
                    "amount": payment.amount,
                    "payment_date": (
                        payment.payment_date.isoformat()
                    )
                }
                for payment in payments
            ]
        }
    }), 200
    

@app.route("/update_patient_waiver/<int:patient_id>", methods=["PATCH"])
def update_patient_waiver(patient_id):
    patient = db.session.get(Patient, patient_id)

    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    data = request.get_json()

    if not data or "waiver_signed" not in data:
        return jsonify({"message": "Waiver status is required"}), 400

    patient.waiver_signed = bool(data["waiver_signed"])

    db.session.commit()

    return jsonify({
        "message": "Waiver status updated successfully",
        "waiver_signed": patient.waiver_signed
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

def add_payment_appointment_column():
    # db.create_all() doesn't add new columns to tables that already exist,
    # so add payment.appointment_id to databases created before it existed.
    payment_table = Payment.__table__.name

    columns = {
        column["name"]
        for column in inspect(db.engine).get_columns(payment_table)
    }

    if "appointment_id" in columns:
        return

    with db.engine.begin() as connection:
        connection.execute(text(
            f"ALTER TABLE {payment_table} "
            "ADD COLUMN appointment_id INTEGER NULL"
        ))


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        add_payment_appointment_column()

    app.run(debug=True)