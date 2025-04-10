import datetime
import sqlite3

from flask import jsonify, redirect, request,flash, url_for

def get_meet():
    now = datetime.datetime.now()
    previous, current, upcoming = [], [], []

    with sqlite3.connect('pimeet.db') as conn:
        c = conn.cursor()
        c.execute("SELECT id, title, date, time, description FROM meetings")
        rows = c.fetchall()

        for row in rows:
            meeting_dt = datetime.datetime.strptime(f"{row[2]} {row[3]}", "%Y-%m-%d %H:%M")
            end_time = meeting_dt + datetime.timedelta(hours=1)  # Assuming 1-hour duration

            item = {
                'id': row[0],
                'title': row[1],
                'date': row[2],
                'time': row[3],
                'description': row[4]
            }

            if end_time < now:
                previous.append(item)
            elif meeting_dt <= now < end_time:
                current.append(item)
            else:
                upcoming.append(item)

    return jsonify({
        'previous': previous,
        'current': current,
        'upcoming': upcoming
    })

def create_meet():
    title = request.form.get('meetingTitle')
    date = request.form.get('meetingDate')
    time = request.form.get('meetingTime')
    description = request.form.get('meetingDescription')

    print("Title:", title)
    print("Date:", date)
    print("Time:", time)
    print("Description:", description)

    if not all([title, date, time, description]):
        return jsonify({'error': 'Missing fields'}), 400

    try:
        conn = sqlite3.connect('pimeet.db')
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO meetings (title, date, time, description)
            VALUES (?, ?, ?, ?)
        """, (title, date, time, description))
        conn.commit()
        conn.close()
        return redirect('/trainer_dashboard')
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Failed to create meeting'}), 500
def edit_meet(meeting_id):
    data = request.get_json()
    try:
        with sqlite3.connect('pimeet.db') as conn:
            cursor = conn.cursor()

            cursor.execute("SELECT * FROM meetings WHERE id = ?", (meeting_id,))
            if not cursor.fetchone():
                return jsonify({"status": "error", "message": "Meeting not found"}), 404

            fields = []
            values = []

            if 'title' in data:
                fields.append("title = ?")
                values.append(data['title'])
            if 'date' in data:
                fields.append("date = ?")
                values.append(data['date'])
            if 'time' in data:
                fields.append("time = ?")
                values.append(data['time'])
            if 'description' in data:
                fields.append("description = ?")
                values.append(data['description'])

            if fields:
                values.append(meeting_id)
                query = f"UPDATE meetings SET {', '.join(fields)} WHERE id = ?"
                cursor.execute(query, tuple(values))
                conn.commit()

        return jsonify({"status": "success", "message": "Meeting updated"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def delete_meet(meeting_id):
    with sqlite3.connect('pimeet.db') as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM meetings WHERE id = ?", (meeting_id,))
        conn.commit()

    return jsonify({'success': True})
def reschedule_meet():
    meeting_id = request.form.get('meeting_id')
    new_date = request.form.get('new_date')
    new_time = request.form.get('new_time')

    if meeting_id and new_date and new_time:
        with sqlite3.connect('pimeet.db') as conn:
            c = conn.cursor()
            c.execute("UPDATE meetings SET date = ?, time = ? WHERE id = ?", (new_date, new_time, meeting_id))
            conn.commit()
        flash("Meeting rescheduled successfully.", "success")
    else:
        flash("Failed to reschedule. Please try again.", "danger")

    return redirect(url_for('trainer_dashboard'))
