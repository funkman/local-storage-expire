/*
  https://github.com/funkman/local-storage-expire
  doc/howto in README.md
*/
define(function() {
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
                      Date object of when to expire
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
      if (!available) {
        if(console && console.log) console.log("Local store is unavailable, expect bad things")
        return;
      }

      if (expires===0 || ((typeof value)==="undefined") || value==null) {
        localStorage.removeItem(key);
        return;
      }


      var expireMS = new Date().getTime();
      if ((typeof expires)==="undefined") {
        expireMS += 5 * 365 * 24 * 3600 * 1000; // 5 year
      } else if (expires instanceof Date) {
        expireMS = expires.getTime();
      } else if ((typeof expires)==="number") {
        expireMS += expires;
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

      var entry = {value: JSON.stringify(value), expires: expireMS}
      localStorage.setItem(key, JSON.stringify(entry));
    },
    getItem: function(key){
      if (!available) {
        if(console && console.log) console.log("Local store is unavailable, expect bad things")
        return null;
      }
      var entry = JSON.parse(localStorage.getItem(key));
      if (entry!=null && (new Date().getTime() < entry.expires)) {
          return JSON.parse(entry.value)
      }

      return null;
    },
    isAvailable : function() {
      return available;
    }
  };
});
