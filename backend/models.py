from config import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False, unique=False)

    def to_json(self):
        return{
            "id" : self.id,
            "user_name" : self.user_name,
        }

class Patient(db.Model):
    __tablename__ = 'patients'

    __table_args__ = (
        db.UniqueConstraint(
        "name",
        "birthdate",
        "email",
        name="uq_patient_identity"
    ),
)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=False)
    email = db.Column(db.String(80), nullable=False, unique=False)
    birthdate = db.Column(db.Date, nullable=False, unique=False)
    age = db.Column(db.Integer, nullable=False, unique=False)
    gender = db.Column(db.String(50), nullable=False, unique=False)
    contact_num = db.Column(db.String(80), nullable=False, unique=False)
    address = db.Column(db.String(100), nullable=False, unique=False)
    weight = db.Column(db.Float, nullable=False, unique=False)
    height = db.Column(db.Float, nullable=False, unique=False)
   

    appointments = db.relationship(
    "Appointment",
    backref="patient",
    lazy=True
)   
    teeth = db.relationship(
        "ToothRecord",
        backref="patient",
        cascade="all, delete-orphan",
        lazy=True
    )

    def to_json(self):
        return{
            "id" : self.id,
            "name" : self.name,
            "email" : self.email,
            "birthdate" : self.birthdate.isoformat(),
            "age" : self.age,
            "gender" : self.gender,
            "contact_num" : self.contact_num,
            "address" : self.address,
            "weight" : self.weight,
            "height" : self.height,
          
        }   

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False, unique=False)
    appointment_date = db.Column(db.Date, nullable=False, unique=False)
    appointment_time = db.Column(db.Time,nullable=False,unique=False)
    reason_for_visit = db.Column(db.String(80), nullable=False, unique=False)
    status = db.Column(db.String(80),nullable=False,unique=False)
     
    def to_json(self):
        return{
            "id" : self.id,
            "patient_id" : self.patient_id,
            "patient_name": self.patient.name,
            "appointment_date" : self.appointment_date.isoformat(),
            "appointment_time" : self.appointment_time.strftime("%I:%M %p"),
            "reason_for_visit" : self.reason_for_visit,
            "status" : self.status
        }


class ToothRecord(db.Model):
    __tablename__ = "tooth_records"

    __table_args__ = (
            db.UniqueConstraint(
                "patient_id",
                "tooth_number",
                name="uq_patient_tooth"
            ),
        )

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    tooth_number = db.Column(db.Integer, unique=False,nullable=False)
    condition = db.Column(db.String(80),nullable=False, unique=False)
    treatment = db.Column(db.String(100),nullable=False,unique=False)
    notes = db.Column(db.Text)

    def to_json(self):
        return{
            "id" : self.id,
            "patient_id" : self.patient_id,
            "tooth_number" : self.tooth_number,
            "condition" : self.condition,
            "treatment" : self.treatment,
            "notes" : self.notes
        }
class AppointmentBalance(db.Model):
    __tablename__ = "patient_documents"

    id = db.Column(db.Integer, primary_key=True)

    patient_id = db.Column(
        db.Integer,
        db.ForeignKey("patients.id"),
        nullable=False,
        unique=True
    )

    next_appointment_date = db.Column(
        db.Date,
        nullable=True
    )

    next_appointment_time = db.Column(
        db.Time,
        nullable=True
    )

    balance = db.Column(
        db.Float,
        default=0.0,
        nullable=False
    )

    next_balance = db.Column(
        db.Float,
        default=0.0,
        nullable=False
    )

    isPaid = db.Column(
        db.String(20),
        default="unpaid",
        nullable=False
    )

    patient = db.relationship(
        "Patient",
        backref=db.backref(
            "appointment_balance",
            uselist=False
        )
    )

    def to_json(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "next_appointment_date": (
                self.next_appointment_date.isoformat()
                if self.next_appointment_date
                else None
            ),
            "next_appointment_time": (
                self.next_appointment_time.strftime("%I:%M %p")
                if self.next_appointment_time
                else None
            ),
            "balance": self.balance,
            "next_balance": self.next_balance,
            "isPaid": self.isPaid
        }