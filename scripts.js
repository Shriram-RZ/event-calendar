document.addEventListener("DOMContentLoaded", function() {
    const calendarDates = document.getElementById('calendarDates');
    const monthYear = document.getElementById('monthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const eventModal = document.getElementById('eventModal');
    const closeModal = document.getElementById('closeModal');
    const eventForm = document.getElementById('eventForm');
    const eventTitle = document.getElementById('eventTitle');
    const eventDate = document.getElementById('eventDate');
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    const eventDescription = document.getElementById('eventDescription');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function loadCalendar() {
        calendarDates.innerHTML = '';
        monthYear.innerHTML = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            calendarDates.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            dayDiv.addEventListener('click', function() {
                eventModal.style.display = 'flex';
                eventDate.value = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            });
            calendarDates.appendChild(dayDiv);
        }
    }

    prevMonth.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        loadCalendar();
    });

    nextMonth.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        loadCalendar();
    });

    closeModal.addEventListener('click', function() {
        eventModal.style.display = 'none';
    });

    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const eventData = {
            event_title: eventTitle.value,
            event_date: eventDate.value,
            start_time: startTime.value,
            end_time: endTime.value,
            description: eventDescription.value
        };fetch('addEvent.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // Ensure the response is JSON
        })
        .then(data => {
            if (data.success) {
                alert('Event added successfully!');
                eventModal.style.display = 'none';
                eventForm.reset();
                loadCalendar(); // Refresh calendar to show the new event
            } else {
                alert('Error adding event: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    loadCalendar();
});
