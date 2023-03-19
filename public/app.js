URL = "127.0.0.1:8080"

const calendar = Vue.defineComponent({
    name: 'calendar',
    props: {
        month: {
        type: Number,
        required: true,
        },
        year: {
        type: Number,
        required: true,
        },
        seats: {
        type: Object,
        required: true,
        },
        reserve: {
        type: Function,
        required: true,
        },
    },
    template: `
        <div id="calendar">
            <div id="header">{{ monthName }} {{ year }}</div>
            <div id="days-of-week">
                <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
            </div>
            <div id="days">
            <div v-for="date in dates" :key="date.getTime()"
                :class="{
                    'not-of-this-month': !(date.getMonth() == this.month - 1),
                    'no-available-seats': !(date.getTime() in dateSeats)}">
                    {{ date.getDate() }} <br>
                    <br>
                    Seats: {{ date.getTime() in dateSeats ? dateSeats[date.getTime()] : 0 }}
                    <button class="booking-button" @click="handleDateClick(date)">Book Now</button>
                </div>
            </div>
        </div>
    `,
    data: function (){
        return {}
    },
    methods: {
        handleDateClick: function (date) {
            this.reserve(date);
        },
    },
    computed: {
        dateSeats() {
            // console.log(this.seats);
            const dateSeats = {};
            for (let date in this.seats) {
              const dateObj = new Date(date);
              dateSeats[dateObj.getTime()] = this.seats[date];
            }
            // console.log(dateSeats);
            return dateSeats;
          },
        monthName() {
            const months = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ];
            return months[this.month - 1];
        },
        daysOfWeek() {
            return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        },
        dates() {
            // console.log(new Date(this.year, this.month, 1), "+0")
            // console.log(new Date(this.year, this.month, 0), "+1")
            // console.log(new Date(this.year, this.month-1, 1), "-1")
            let daysInMonth = new Date(this.year, this.month, 0).getDate();
            let firstDayOfMonth = new Date(this.year, this.month-1, 1).getDay();
            // console.log(firstDayOfMonth, "first")
            let lastDayOfMonth = new Date(this.year, this.month, 0).getDay();
            // console.log(lastDayOfMonth, "last")
            let dates = [];
        
            // add days from previous month
            let daysInPrevMonth = new Date(this.year, this.month-1, 0).getDate();
            for (let i = firstDayOfMonth - 1; i >= 0; i--) {
                let date = new Date(this.year, this.month - 2, daysInPrevMonth - i);
                dates.push(date);
            }
        
            // add days from current month
            for (let i = 1; i <= daysInMonth; i++) {
                // console.log(i, "i")
                // console.log(daysInMonth, "days")
                let date = new Date(this.year, this.month-1, i);
                // console.log(date)
                dates.push(date);
            }
        
            // add days from next month
            let daysLeft = 6 - lastDayOfMonth;
            for (let i = 1; i <= daysLeft; i++) {
                let date = new Date(this.year, this.month, i);
                dates.push(date);
            }
            // console.log(dates[0]);
            // console.log(dates[0].getTime());
            return dates;
        }
    },
});
const app = Vue.createApp({
    data: function () {
        return {
            seePrivate: false,
            seeContact: false,
            reserving: false,
            addDatesBox: false,
            updateDates: false,
            deleteDatesBox: false,
            filledSeats: false,
            seeLogIn: false,
            loggedIn: false,
            showReserveBox: false,
            whoAmI: false,
            expectations: false,
            overlay: false,
            submitStatus: '',
            reserveDate: -1,
            reserveDateOBJ: '',
            month: -1,
            year: 1,
            logMessage: '',
            username: '',
            password: '',
            inputMonth: '',
            inputYear: '',
            inputDate: '',
            inputSeats: '',
            inputName: '',
            dateMSG: '',
            errorMSG: '',
            seatsWarn: '',
            filledSeatsList: [],
            availableDates: {},
            contactFormData: {
                name: '',
                number: '',
                email: '',
                date: '',
                body: '',
            },

            header: "Choc Co. Lot",
            chocolate: "",
            locale: "",
            inventory: 0,
            chocolates: [],
        };
    },
    methods: {
        calendarScrollCombiner: function() {
            this.showCalendar();
            setTimeout(() => {
                this.scrollToCalendar();
              }, 20);
        },
        scrollToCalendar: function() {
            const calendar = this.$refs.calendar;
            const calendarPosition = calendar.getBoundingClientRect();
            const scrollPosition = window.pageYOffset + calendarPosition.top;
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        },
        showContact: function () {
            this.seeContact = true;
            this.overlay = true;
        },
        showCalendar: function () {
            this.reserving = true;
        },
        showPrivate: function(){
            this.seePrivate = true;
            this.overlay = true;
        },
        showExpect: function(){
            this.expectations= true;
            this.overlay = true;
        },
        showME: function(){
            this.whoAmI = true;
            this.overlay = true;
        },
        nextMonth: function () {
            if(this.month == 12){
                this.year = this.year + 1;
                this.month = 1;
            }else{
                this.month = this.month + 1;
            }
        },
        prevMonth: function () {
            if(this.month == this.currentMonth){
                return;
            }else if(this.month == 1 && this.year != this.currentYear){
                this.year = this.year-1;
                this.month = 12;
            }else{
                this.month = this.month - 1;
            }
        },
        showLogIn: function () {
            this.seeLogIn = true;
            this.overlay = true;
        },
        logIn: async function (){
            let data = await this.getUser();
            if (data[0].username == this.username && data[0].password == this.password){
                this.username = '';
                this.password = '';
                this.loggedIn = true;
                this.seeLogIn = false;
            }else{
            this.logMessage = `Incorrect Username or Password`;
            }
        },
        showAddDates: function() {
            this.addDatesBox = true;
            this.overlay = true;
        },
        showupdateDates: function() {
            this.updateDates = true;
            this.overlay = true;
        },
        showGetSeats: function() {
            this.filledSeats = true;
            this.overlay = true;
        },
        showDeleteDates: function() {
            this.deleteDatesBox = true;
            this.overlay = true;
        },
        reserveBox: function (date) {
            this.reserveDateOBJ = date;
            // console.log(date.toLocaleDateString('en-US'));
            let formattedDate = date.toLocaleDateString('en-US');
            this.reserveDate = formattedDate;
            this.showReserveBox = true;
            this.overlay = true;
        },
        LogOut: function() {
            this.loggedIn = false;
            this.overlay = false;
        },
        hideLogIn: function () {
            this.seeLogIn = false;
            this.overlay = false;
        },
        hideContact: function () {
            this.seeContact = false;
            this.overlay = false;
        },
        hideCalendar: function () {
            this.reserving = false;
        },
        hidePrivate: function(){
            this.contactFormData.name = '';
            this.contactFormData.number = '';
            this.contactFormData.email = '';
            this.contactFormData.date = '';
            this.contactFormData.body = '';
            this.seePrivate = false;
            this.overlay = false;
        },
        hideExpect: function(){
            this.expectations = false;
            this.overlay = false;
        },
        hideME: function(){
            this.whoAmI = false;
            this.overlay = false;
        },
        hideAddDates: function () {
            this.addDatesBox = false;
            this.overlay = false;
            this.dateMSG = '';
            this.inputDate = '';
            this.inputMonth = '';
            this.inputYear = '';
            this.inputSeats = '';
        },
        hideGetSeats: function () {
            this.filledSeats = false;
            this.overlay = false;
            this.dateMSG = '';
            this.inputDate = '';
            this.inputMonth = '';
            this.inputYear = '';
            this.inputSeats = '';
        },
        hideDeleteDates: function () {
            this.deleteDatesBox = false;
            this.overlay = false;
            this.dateMSG = '';
            this.inputDate = '';
            this.inputMonth = '';
            this.inputYear = '';
            this.inputSeats = '';
        },
        hideupdateDates: function () {
            this.updateDates = false;
            this.overlay = false;
            this.dateMSG = '';
            this.inputDate = '';
            this.inputMonth = '';
            this.inputYear = '';
            this.inputSeats = '';
        },
        hideReserveBox: function () {
            this.showReserveBox = false;
            this.overlay = false;
            this.reserveDate = -1;
            this.errorMSG = '';
            this.inputDate = '';
            this.inputMonth = '';
            this.inputYear = '';
            this.inputSeats = '';
        },
        addDate: function() {
            if(this.inputMonth == '' || this.inputDate == '' || this.inputYear == '' || this.inputSeats == ''){
                this.dateMSG = 'Please Fill out all Fields.'
                return;
            }
            var shortMonths = [4, 6, 9, 11];
            if(this.inputMonth == 2 && this.inputDate > 28){
                this.dateMSG = 'Invalid date: February only has 28 days';
                return;
            }else if(shortMonths.includes(this.inputMonth) && this.inputDate > 30){
                this.dateMSG = 'Invalid date: That month only has 30 days';
                return;
            }else{
                let thisDate = new Date(this.inputYear, this.inputMonth - 1, this.inputDate);
                let date = thisDate.toISOString();
                let newDate = {
                    'date': date,
                    'seats': this.inputSeats,
                }
                this.postDate(newDate);
            }
        },
        removeDate: function() {
            if(this.inputMonth == '' || this.inputDate == '' || this.inputYear == ''){
                this.dateMSG = 'Please Fill out all Fields.'
                return;
            }
            var shortMonths = [4, 6, 9, 11];
            if(this.inputMonth == 2 && this.inputDate > 28){
                this.dateMSG = 'Invalid date: February only has 28 days';
                return;
            }else if(shortMonths.includes(this.inputMonth) && this.inputDate > 30){
                this.dateMSG = 'Invalid date: That month only has 30 days';
                return;
            }else{
                let thisDate = new Date(this.inputYear, this.inputMonth - 1, this.inputDate);
                let date = thisDate.toISOString();
                this.deleteDate(date)
            }
        },
        runUpdates: async function (){
            if(this.inputMonth == '' || this.inputDate == '' || this.inputYear == ''){
                this.dateMSG = 'Please Fill out all Fields.'
                return;
            }
            var shortMonths = [4, 6, 9, 11];
            if(this.inputMonth == 2 && this.inputDate > 28){
                this.dateMSG = 'Invalid date: February only has 28 days';
                return;
            }else if(shortMonths.includes(this.inputMonth) && this.inputDate > 30){
                this.dateMSG = 'Invalid date: That month only has 30 days';
                return;
            }else{
                let date = new Date(this.inputYear, this.inputMonth - 1, this.inputDate);
                // let date = thisDate.toISOString();
                let seats = {'seats': this.inputSeats};
                console.log(this.inputSeats);
                console.log(date);
                this.patchDate(date, seats);
            }
        },
        runGetSeats: async function(){
            if(this.inputMonth == '' || this.inputDate == '' || this.inputYear == ''){
                this.dateMSG = 'Please Fill out all Fields.'
                return;
            }
            var shortMonths = [4, 6, 9, 11];
            if(this.inputMonth == 2 && this.inputDate > 28){
                this.dateMSG = 'Invalid date: February only has 28 days';
                return;
            }else if(shortMonths.includes(this.inputMonth) && this.inputDate > 30){
                this.dateMSG = 'Invalid date: That month only has 30 days';
                return;
            }else{
                let date = new Date(this.inputYear, this.inputMonth - 1, this.inputDate);
                // let date = thisDate.toISOString();
                let seats = await this.getSeats(date);
                this.filledSeatsList = seats;
                console.log(this.filledSeatsList);
            }
        },
        bookSeats: async function() {
            this.errorMSG = '';
            var seats = 'not found';

            let seatOBJ = {
                'name': this.inputName,
                'date': this.reserveDate,
                'party': this.inputSeats
            };
            if(this.reserveDateOBJ.toISOString() in this.availableDates){
                seats = this.availableDates[this.reserveDate];
            }
            console.log(this.reserveDateOBJ);
            console.log(this.availableDates);
            if(seats == 'not found'){
                this.errorMSG = "Date Not Available";
                return;
            }else if(seats < this.inputSeats){
                this.errorMSG = "Not Enough Seats Available for Selected Date";
                return;
            }else{
                this.errorMSG = '';
                this.postSeats(seatOBJ);
            }
        },
        submitForm: async function() {
            try {
              let response = await fetch("/send-email", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(this.contactFormData),
                headers: {
                  "Content-Type": "application/json",
                },
              });
              console.log(response.status);
              if (response.status === 200) {
                this.submitStatus = "success";
                this.contactFormData = { name: "", email: "", number: "", date: "", body: "" };
              } else {
                this.submitStatus = "error";
              }
            } catch (error) {
              this.submitStatus = "error";
            }
          },
        // newDate: function () {
        //     let newDate = {
        //         'date': this.today.toISOString(),
        //         'seats': 5
        //     }
        //     this.POSTdate(newDate);
        // },
        // addchocolate: function () {
        //     newchocolate = {
        //         'chocolate': this.chocolate,
        //         'locale': this.locale,
        //         'inventory': this.inventory,
        //     }
        //     this.POSTchocolate(newchocolate);
        // },
        // GETchocolates: async function () {
        //     let response = await fetch(`/chocolates`, {
        //         method: "GET",
        //         credentials: "include",
        //     })
        //     let data = await response.json();
        //     // console.log(response.status);
        //     // console.log(data);
        //     this.chocolates = data;
        // },
        // POSTchocolate: async function (newchocolate) {
        //     let response = await fetch(`/chocolates`,{
        //         method: 'POST',
        //         credentials: 'include',
        //         body: JSON.stringify(newchocolate),
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //     })
        //     let data = await response.json;
        //     // console.log(response.status);
        //     // console.log(data);
        //     if(response.status == 201){
        //         this.GETchocolates();
        //     }
        // },

        postDate: async function (newDate) {
            let response = await fetch(`/dates`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(newDate),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            let data = await response.json;
            // console.log(response.status);
            // console.log(data);
            if(response.status == 201){
                console.log(newDate['date'].getTime());
                // console.log('date added');
                this.dateMSG = 'date added';
                this.inputDate = '';
                this.inputMonth = '';
                this.inputYear = '';
                this.inputSeats = '';
                this.getDates();
            }
        },
        // getDate: async function (date){
        //     let response = await fetch(`/dates/${date}`, {
        //         method: 'GET',
        //         credentials: 'include',
        //     });
        //     if(response.status == 200){
        //         let data = await response.json();
        //         return data;
        //     }else if(response.status == 404){
        //         return 'not found';
        //     };
        // },
        getDates: async function(){
            let response = await fetch('/dates', {
                method: 'GET',
                credentials: 'include',
            });
            var dateDict = {}
            if (response.status == 200){
                let data = await response.json()
                // console.log(data)
                for(let i = 0; i < data.length; i++){
                    dateDict[data[i].date] = data[i].seats;
                }
                this.availableDates = dateDict
                // console.log(dateDict);
            }else{
                // console.log('get dates error', reponse.status);
            }
            // console.log(this.availableDates);
        },
        deleteDate: async function (date){
            let response = await fetch(`/dates/${date}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if(response.status == 204){
                console.log(response.status);
                this.dateMSG = 'Date has been Removed.'
                this.getDates();
            }
            console.log(response.status);
        },
        patchDate: async function (date, seats){
            let response = await fetch(`/dates/${date}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(seats),
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log(response.status);
            if(response.status == 204){
                console.log('date updated');
                this.getDates();
                return;
            }else{
                console.log("Error updating date.");
            }
        },
        getUser: async function (){
            let response = await fetch('/users', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.status == 200){
                let data = await response.json();
                return data;
            }else{
                // console.log('get user error', response.status);
            }
        },
        postSeats: async function(seat){
            let response = await fetch(`/seats`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(seat),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            let data = await response.json;
            if(response.status == 201){
                this.errorMSG = 'Congratulations';
                this.inputReqDate = '';
                this.inputName = '';
                this.inputSeats = '';
                this.getDates();
            }
        },
        getSeats: async function(date){
            let response = await fetch(`/seats/${date}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.status == 200){
                let data = await response.json();
                this.seatsWarn = '';
                this.inputDate = '';
                this.inputMonth = '';
                this.inputYear = '';
                console.log(data,'from server');
                return data;
            }else{
                // console.log('get seats error', response.status);
                this.seatsWarn = 'No seats found for date.'
            }
        },
    },
    created: function () {
        this.month = this.currentMonth;
        this.year = this.currentYear;
        this.getDates();
    },
    computed: {
        currentMonth(){
            let today = new Date();
            return today.getMonth() + 1;
        },
        currentYear(){
            let today = new Date();
            return today.getFullYear();
        },
        showPrevMonthButton(){
            return !(this.month == this.currentMonth && this.year == this.currentYear)
        },
    },
})
app.component('calendar', calendar);
app.mount('#app');