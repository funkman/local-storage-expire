/*
  See README.md
*/
define(function() {
  "use strict";
  var available= false;

  try {
      // test 1 - ensure JSON
      if (((typeof JSON.parse)==="function") && ((typeof JSON.stringify) === "function")) {
        // test 2 - ensure localStorage
        var test = 'x';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
      }
      available = true;
  } catch(e) {

  }

  return {
    /*
      expiration = either of
                      time in millis, 0 to remove now
                      hash with any of
                          {
                            years:31,
                            days:14,
                            hours:551,
                            minutes:4532,
                            seconds:42
                          }

    */
    setItem : function(key, value, expires){
      if (!available){return false;}

      if (expires===0 || ((typeof value)==="undefined")) {
        localStorage.removeItem(key);
        return value;
      }


      var expireMS = 0;
      if ((typeof expires)==="undefined") {
        expireMS = 5 * 365 * 24 * 3600 * 1000; // 5 year
      } else if ((typeof expires)==="number") {
        expireMS = expires;
      } else {
        if ((typeof expires.years)==="number" && expires.years>0) {
          expireMS += (expires.years * 365 * 24 * 3600 * 1000)
        }
        if ((typeof expires.days)==="number" && expires.days>0) {
          expireMS += (expires.days * 24 * 3600 * 1000)
        }
        if ((typeof expires.hours)==="number" && expires.hours>0) {
          expireMS += (expires.hours * 3600 * 1000)
        }
        if ((typeof expires.minutes)==="number" && expires.minutes>0) {
          expireMS += (expires.minutes * 60 * 1000)
        }
        if ((typeof expires.seconds)==="number" && expires.seconds>0) {
          expireMS += (expires.seconds * 1000)
        }
      }

      var entry = {value: JSON.stringify(value), expires: new Date().getTime() + expireMS}
      localStorage.setItem(key, JSON.stringify(entry));
      return value;
    },
    getItem: function(key){
      if (!available){return false;}

      var entry = JSON.parse(localStorage.getItem(key));
      if (!entry){return false;}
      return (new Date().getTime() < entry.expires && JSON.parse(entry.value));
    },
    isAvailable : function() {
      return available;
    }
  };
});
