import os
from datetime import timedelta

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.engine import URL

load_dotenv()

app = Flask(__name__)

secret_key = os.getenv("SECRET_KEY")
if not secret_key:
    raise RuntimeError("SECRET_KEY must be configured before the application starts.")

is_production = (
    os.getenv("FLASK_ENV", "").lower() == "production"
    or os.getenv("RENDER", "").lower() == "true"
)

frontend_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173",
    ).split(",")
    if origin.strip()
]

if is_production and (
    not frontend_origins
    or "http://localhost:5173" in frontend_origins
):
    raise RuntimeError(
        "Set FRONTEND_ORIGINS to the exact deployed frontend origin(s)."
    )

app.config.update(
    SECRET_KEY=secret_key,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=is_production,
    SESSION_COOKIE_SAMESITE="None" if is_production else "Lax",
    PERMANENT_SESSION_LIFETIME=timedelta(hours=8),
    CORS_ORIGINS=frontend_origins,
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    SQLALCHEMY_ENGINE_OPTIONS={
        "pool_pre_ping": True,
        "pool_recycle": 280,
    },
)

CORS(
    app,
    resources={r"/*": {"origins": frontend_origins}},
    supports_credentials=True,
)

database_url = URL.create(
    drivername="mysql+pymysql",
    username=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT", "3306")),
    database=os.getenv("DB_NAME"),
)
app.config["SQLALCHEMY_DATABASE_URI"] = database_url.render_as_string(
    hide_password=False
)

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv("EMAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("EMAIL_PASSWORD")

mail = Mail(app)
db = SQLAlchemy(app)
