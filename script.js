document.addEventListener('DOMContentLoaded', function () {
    const calendar = document.getElementById('calendar');
    const eventModal = document.getElementById('eventModal');
    const closeModalBtn = document.querySelector('#eventModal .close');
    const eventForm = document.getElementById('eventForm');

    const prevYearBtn = document.getElementById('prevYear');
    const nextYearBtn = document.getElementById('nextYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const yearLabel = document.getElementById('year');
    const monthLabel = document.getElementById('month');

    const eventDetailsPanel = document.getElementById('eventDetailsPanel');
    const closeDetailsBtn = document.getElementById('closeDetails');
    const eventDetails = document.getElementById('eventDetails');
    const addEventBtn = document.getElementById('addEventBtn');
    const deleteEventsBtn = document.getElementById('deleteEventsBtn');
    const menuIcon = document.getElementById('menuIcon');
    const selectedDateLabel = document.getElementById('selectedDate');
    const fetchEventsBtn = document.getElementById('fetchEventsBtn');

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    function renderCalendar(year, month) {
        calendar.innerHTML = '';
        yearLabel.textContent = year;
        monthLabel.textContent = monthNames[month];

        const firstDay = new Date(year, month).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const blankDay = document.createElement('div');
            blankDay.classList.add('calendar-day', 'empty');
            calendar.appendChild(blankDay);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = i;
            dayElement.addEventListener('click', () => showEventDetails(year, month, i));
            calendar.appendChild(dayElement);
        }
    }

    function showEventDetails(year, month, day) {
        eventDetailsPanel.classList.add('show');
        const dateKey = `${year}-${month + 1}-${day}`;
        selectedDateLabel.textContent = dateKey;
        fetchEvents(dateKey);
    }

    function fetchEvents(dateKey) {
        fetch(`get_events.php?date=${dateKey}`)
            .then(response => response.json())
            .then(data => {
                eventDetails.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(event => {
                        const eventItem = document.createElement('div');
                        eventItem.classList.add('event-item');
                        eventItem.innerHTML = `
                            <input type="checkbox" class="event-checkbox" value="${event.id}">
                            ${event.title} - ${event.time} 
                            <br><small>Start: ${event.start_date}, End: ${event.end_date}</small>
                        `;
                        eventDetails.appendChild(eventItem);
                    });
                } else {
                    eventDetails.innerHTML = '<p>No events for today</p>';
                }
            })
            .catch(error => console.error('Error fetching events:', error));
    }

    function fetchAllEvents() {
        fetch('get_all_events.php')
            .then(response => response.json())
            .then(data => {
                eventDetails.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(event => {
                        const eventItem = document.createElement('div');
                        eventItem.classList.add('event-item');
                        eventItem.innerHTML = `
                            <input type="checkbox" class="event-checkbox" value="${event.id}">
                            ${event.title} - ${event.time} 
                            <br><small>Start: ${event.start_date}, End: ${event.end_date}</small>
                        `;
                        eventDetails.appendChild(eventItem);
                    });
                    eventDetailsPanel.classList.add('show');
                } else {
                    eventDetails.innerHTML = '<p>No events available</p>';
                }
            })
            .catch(error => console.error('Error fetching all events:', error));
    }

    function deleteSelectedEvents() {
        const checkboxes = document.querySelectorAll('.event-checkbox:checked');
        const ids = Array.from(checkboxes).map(cb => cb.value);
        if (ids.length === 0) return;

        fetch('delete_events.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: ids }),
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            fetchEvents(selectedDateLabel.textContent); 
        })
        .catch(error => console.error('Error deleting events:', error));
    }

    function addEvent(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const time = document.getElementById('time').value;

        fetch('add_event.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                start_date: startDate,
                end_date: endDate,
                time: time
            }),
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            eventModal.style.display = 'none';
            fetchEvents(selectedDateLabel.textContent);
        })
        .catch(error => console.error('Error adding event:', error));
    }

    prevYearBtn.addEventListener('click', () => {
        currentYear--;
        renderCalendar(currentYear, currentMonth);
    });

    nextYearBtn.addEventListener('click', () => {
        currentYear++;
        renderCalendar(currentYear, currentMonth);
    });

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    });

    closeDetailsBtn.addEventListener('click', () => {
        eventDetailsPanel.classList.remove('show');
    });

    fetchEventsBtn.addEventListener('click', fetchAllEvents);
    deleteEventsBtn.addEventListener('click', deleteSelectedEvents);

    addEventBtn.addEventListener('click', () => {
        eventModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        eventModal.style.display = 'none';
    });

    eventForm.addEventListener('submit', addEvent);

    renderCalendar(currentYear, currentMonth);
});
