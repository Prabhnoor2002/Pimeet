from flask import render_template, redirect, url_for, flash
from dotenv import load_dotenv
import os
from db import get_db_connection

# Load environment variables from .env file
load_dotenv()

# Secret keys for admin and trainer roles
ADMIN_SECRET_KEY = os.getenv('ADMIN_SECRET_KEY')
TRAINER_SECRET_KEY = os.getenv('TRAINER_SECRET_KEY')

def handle_signup(request):
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        role = request.form.get('role')
        secret_key = request.form.get('secret_key')  # Get the secret key from the form

        # Validate secret key for admin and trainer roles
        if role == 'admin' and secret_key != ADMIN_SECRET_KEY:
            flash('Invalid secret key for Admin!', 'danger')
            return redirect(url_for('signup'))

        if role == 'trainer' and secret_key != TRAINER_SECRET_KEY:
            flash('Invalid secret key for Trainer!', 'danger')
            return redirect(url_for('signup'))

        # Save user to the database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                (username, email, password, role)
            )
            conn.commit()
            conn.close()
            flash(f'Successfully signed up as {role.capitalize()}!', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            flash(f'Error: {str(e)}', 'danger')
            return redirect(url_for('signup'))

    return render_template('signup.html')