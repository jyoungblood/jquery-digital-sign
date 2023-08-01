
var sign = {

  blackwhite_build: false,
  current_slide: 0,
  current_timeout: false,

  // update the clock every minute
  clock: function () {
    var ths = this;
    var currentTime = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = monthNames[currentTime.getMonth()] + " " + currentTime.getDate() + ", " + currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var am = 'am';
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (hours > 11) {
      am = 'pm';
    }
    var h = hours;
    if (hours >= 12) {
      h = hours - 12;
      am = "pm";
    }
    if (hours == 0 || h == 0) {
      h = 12;
    }
    var time = h + ':' + minutes + am;
    $("#clock-date").text(date);
    $("#clock-time").text(time);
    $("#home-date-day").text(dayNames[currentTime.getDay()]);
    $("#home-date-date").text(date);
    $("#home-date-time").text(time);
    this.bw(time);
    setTimeout(function () {
      ths.clock();
    }, 1000);
  },

  // save the screens (show solid black/white for 10 seconds, once an hour)
  bw: function (time) {
    var minute = time.split(":");
    var min = minute[1].substr(0, 2);
    if (min == 59 && !this.blackwhite_build) {
      this.blackwhite_build = true;
      $("#saver-black").show();
      setTimeout(function () {
        $("#saver-black").hide();
        $("#saver-white").show();
        setTimeout(function () {
          $("#saver-white").hide();
          setTimeout(function () {
            $("#saver-white").hide();
            window.location.reload();
          }, 40000);
        }, 10000);
      }, 10000);
    }
    if (min == 60) {
      this.blackwhite_build = false;
    }
  },

  // handle animation between slides
  animate_slides: function (_id) {
    var ths = this;
    ths.current_slide = _id;
    if ($(".slide.active").length > 0) {
      $(".slide.active").animate({ opacity: 0 }, 1000, function () {
        $(this).removeClass('active');
      });
    }
    $(".slide[data-order='" + _id + "']").animate({ opacity: 1 }, 1000, function () {
      $(this).addClass('active');
    });
    var duration = $(".slide[data-order='" + _id + "']").data('duration');

    ths.current_timeout = setTimeout(function () {
      var next = _id + 1;
      if ($(".slide[data-order='" + next + "']").length > 0) {
        ths.animate_slides(next);
      } else {
        ths.animate_slides(0);
      }
    }, duration);
  },

  // manually change the active slide
  navigate_slides: function(e) {
    // left arrow
    if (e.which == 37) {
      clearTimeout(this.current_timeout);
      var prev = this.current_slide - 1;
      if (prev < 0){
        prev = $(".slide").length - 1;
      }
      sign.animate_slides(prev);
    }
    // right arrow
    if (e.which == 39) {
      clearTimeout(this.current_timeout);
      var next = this.current_slide + 1;
      if (!$(".slide[data-order='" + next + "']").length > 0) {
        next = 0;
      }
      sign.animate_slides(next);
    }
  },

  // copied from here: https://gist.github.com/micah1701/4120120
    // modified to accept unix timestamp
  dateFormat: function (format, unix_timestamp){
    var date = new Date(unix_timestamp * 1000);    
    var string = '',
      mo = date.getMonth(),   // month (0-11)
      m1 = mo+1,			    // month (1-12)
      dow = date.getDay(),    // day of week (0-6)
      d = date.getDate(),     // day of the month (1-31)
      y = date.getFullYear(), // 1999 or 2003
      h = date.getHours(),    // hour (0-23)
      mi = date.getMinutes(), // minute (0-59)
      s = date.getSeconds();  // seconds (0-59)
    for (var i = 0, len = format.length; i < len; i++) {
      switch(format[i])
      {
        case 'j': // Day of the month without leading zeros  (1 to 31)
          string+= d;
          break;
        
        case 'd': // Day of the month, 2 digits with leading zeros (01 to 31)
          string+= (d < 10) ? "0"+d : d;
          break;
        
        case 'l': // (lowercase 'L') A full textual representation of the day of the week
          var days = Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
          string+= days[dow];
          break;
          
        case 'w': // Numeric representation of the day of the week (0=Sunday,1=Monday,...6=Saturday)
          string+= dow;
          break;
          
        case 'D': // A textual representation of a day, three letters
          days = Array("Sun","Mon","Tue","Wed","Thr","Fri","Sat");
          string+= days[dow];
          break;	
        
        case 'm': // Numeric representation of a month, with leading zeros (01 to 12)
          string+= (m1 < 10) ? "0"+m1 : m1;
          break;	
      
        case 'n': // Numeric representation of a month, without leading zeros (1 to 12)
          string+= m1;
          break;
        
        case 'F': // A full textual representation of a month, such as January or March 
          var months = Array("January","February","March","April","May","June","July","August","September","October","November","December");
          string+= months[mo];
          break;
          
        case 'M': // A short textual representation of a month, three letters (Jan - Dec)
          months = Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
          string+= months[mo];
          break;
            
        case 'Y': // A full numeric representation of a year, 4 digits (1999 OR 2003)	
          string+= y;
          break;
          
        case 'y': // A two digit representation of a year (99 OR 03)
          string+= y.toString().slice(-2);
          break;
          
        case 'H': // 24-hour format of an hour with leading zeros (00 to 23)
          string+= (h < 10) ? "0"+h : h;
          break;
        
        case 'g': // 12-hour format of an hour without leading zeros (1 to 12)
          var hour = (h===0) ? 12 : h;
          string+= (hour > 12) ? hour -12 : hour;
          break;
          
        case 'h': // 12-hour format of an hour with leading zeros (01 to 12)
          hour = (h===0) ? 12 : h;
          hour = ( hour > 12) ? hour -12 : hour;
          string+= (hour < 10) ? "0"+hour : hour;
          break;
        
        case 'a': // Lowercase Ante meridiem and Post meridiem (am or pm)
          string+= (h < 12) ? "am" : "pm";
          break;		
        
        case 'i': // Minutes with leading zeros (00 to 59)
          string+= (mi < 10) ? "0"+mi : mi;
          break;
        
        case 's': // Seconds, with leading zeros (00 to 59)
          string+= (s < 10) ? "0"+s : s;
          break;
          
        case 'c': // ISO 8601 date (eg: 2012-11-20T18:05:54.944Z)
          string+= date.toISOString();
          break;		
          
        default:
          string+= format[i];
      }
    }

    return string;
  },

  // from DW utilities
  formbody_encode: function (data) {
    return Object.entries(data).map(([k, v]) => { return k + '=' + v }).join('&');
  },

  // from DW utilities
  api_fetch: function (cfg) {
    let parameters = {
      method: cfg.method ? cfg.method : 'POST',
      headers: {
        'Content-type': cfg.json ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json'
      }
    };
    if (cfg.method === 'GET') {
      let query_string = new URLSearchParams(cfg.data).toString();
      cfg.url = cfg.url + '?' + query_string;
    } else {
      parameters.body = cfg.json ? JSON.stringify(cfg.data) : this.formbody_encode(cfg.data);
    }
    return fetch(cfg.url, parameters).then(response => response.json()).catch(error => {
      alert(`Network error: ${error}`);
      console.log(error);
    });
  },

  // sign init
  init: function (cb = () => { }) {

    $(function () {
      sign.clock();
      sign.animate_slides(0);
      cb();
    });

    window.addEventListener('keyup', (event) => {
      sign.navigate_slides(event);
    });

    window.addEventListener('beforeunload', (event) => {
      $("body").addClass('fade-out');
    });

  }
};