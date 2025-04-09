from flask import render_template, redirect, url_for, session, flash, jsonify, request, current_app
from dotenv import load_dotenv
import os
from db import get_db_connection

# Load environment variables from .env file
load_dotenv()

# Secret keys for admin and trainer roles
ADMIN_SECRET_KEY = os.getenv('ADMIN_SECRET_KEY')
TRAINER_SECRET_KEY = os.getenv('TRAINER_SECRET_KEY')

def get_user_from_db(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id,username, email,password, role FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()
    return user

# Route to fetch the role of a user
def register_routes(app):
    @app.route('/get_role', methods=['GET'])
    def get_role():
        username = request.args.get('username')
        user = get_user_from_db(username)
        if user:
            return jsonify({"role": user[4]})  # Return the role from the database
        return jsonify({"role": "user"})  # Default to "user" if not found

def handle_login(request):
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        secret_key = request.form.get('secret_key')  

        # Fetch user from the database
        user = get_user_from_db(username)
        if not user:
            flash('Invalid username or password!', 'danger')
            return redirect(url_for('login'))

        db_id, db_username, db_email, db_password, db_role = user


        # Validate password
        if password != db_password:
            flash('Invalid username or password!', 'danger')
            return redirect(url_for('login'))

        # Validate secret key for admin and trainer roles
        if db_role == 'admin' and secret_key != ADMIN_SECRET_KEY:
            flash('Invalid secret key for Admin!', 'danger')
            return redirect(url_for('login'))

        if db_role == 'trainer' and secret_key != TRAINER_SECRET_KEY:
            flash('Invalid secret key for Trainer!', 'danger')
            return redirect(url_for('login'))

        # Set session role and redirect to the appropriate dashboard
        session['user_id'] = user[0]  
        session['username'] = user[1]
        session['email'] = user[2]
        session['role'] = user[4]
        
        flash(f'Welcome, {username}!', 'success')
        if db_role == 'admin':
            return redirect(url_for('admin_dashboard'))
        elif db_role == 'trainer':
            return redirect(url_for('trainer_dashboard'))
        else:
            return redirect(url_for('user_dashboard'))

    return render_template('login.html')