from flask import Flask, Response, redirect, url_for, request, render_template
from signup import handle_signup
from login import handle_login, register_routes
from db import init_db
from functools import wraps
from flask import session, flash
from uploadimg import handle_profile_image_upload
from profileimg import get_image



app = Flask(__name__)
app.secret_key = 'Pisoft'


init_db()

register_routes(app)
def login_required(role=None):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if 'role' not in session:
                flash('You must be logged in to access this page.', 'danger')
                return redirect(url_for('login'))
            if role and session['role'] != role:
                flash('You do not have permission to access this page.', 'danger')
                return redirect(url_for('login'))
            return func(*args, **kwargs)
        return wrapper
    return decorator


@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    return handle_login(request)
@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    return handle_signup(request)


@app.route('/admin_dashboard')
@login_required(role='admin')
def admin_dashboard():
    return render_template('admindashboard.html')
@app.route('/trainer_dashboard')
@login_required(role='trainer')
def trainer_dashboard():
    user_details = {
        'id': session.get('user_id'),
        'name': session.get('username'),
        'email':session.get('email'),
        'role': session.get('role')
    }
    return render_template('trainerdashboard.html', user=user_details)
@app.route('/user_dashboard')
@login_required(role='user')
def user_dashboard():
    return render_template('userdashboard.html')

@app.route('/upload_profile', methods=['POST'])
@login_required()  
def upload_profile():
    print('pk upload')
    return handle_profile_image_upload()

@app.route('/get_profile_image/<int:user_id>')
def get_profile_image(user_id):
    image_blob = get_image(user_id)
    if image_blob:
        return Response(image_blob, mimetype='image/png')  
    return 'No Image Found', 404

if __name__ == '__main__':
    app.run(debug=True)