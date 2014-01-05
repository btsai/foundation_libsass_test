/* year as 'yyyy' or 'yy'
 * month as 'MM' (padded number) or 'MMM' (month name, english first 3 letters)
 * date as 'dd'
 * hour as 'hh' (12 hour clock) or 'HH' 24 hour clock or 'hht' for x=am/pm
 * minute as 'mm'
 * second as 'ss'
 */
Date.prototype.format = function(format) {
  var date = this;
  if (!format) {
    format="MM/dd/yyyy";
  }

  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  if (format.match(/MMM/)) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    format = format.replace("MMM", months[month - 1].toString());
  }
  else {
    format = format.replace("MM",month.toString().padLeft(2,"0"));
  }

  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy",year.toString());
  }
  else if (format.indexOf("yy") > -1) {
    format = format.replace("yy",year.toString().substr(2,2));
  }
  format = format.replace("dd",date.getDate().toString().padLeft(2,"0"));

  var hours = date.getHours();
  if (format.indexOf("x") > -1) {
    if (hours > 11) {
      format = format.replace("x","pm")
    }
    else {
      format = format.replace("x","am")
    }
  }
  if (format.indexOf("HH") > -1) {
    format = format.replace("HH",hours.toString().padLeft(2,"0"));
  }
  if (format.indexOf("hh") > -1) {
    if (hours > 12) {
      hours - 12;
    }
    if (hours == 0) {
      hours = 12;
    }
    format = format.replace("hh",hours.toString().padLeft(2,"0"));
  }
  if (format.indexOf("mm") > -1) {
    format = format.replace("mm",date.getMinutes().toString().padLeft(2,"0"));
  }
  if (format.indexOf("ss") > -1) {
    format = format.replace("ss",date.getSeconds().toString().padLeft(2,"0"));
  }
  return format;
}

Date.prototype.beginningOfDay = function(){
  return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
}

Date.prototype.endOfDay = function(){
  return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 23, 59, 59.9);
}

Date.prototype.offsetHours = function(hourOffset) {
  var date = new Date(this);
  date.setHours(date.getHours() + hourOffset);
  return date;
}

String.repeat = function(chr,count) {
  var str = '';
  for (var x = 0; x < count; x++) {
    {str += chr};
  }
  return str;
}

String.prototype.padLeft = function(width, pad) {
  if (!width || width < 1) {
    return this;
  }
  if (!pad) {
    pad = ' ';
  }

  var length = width - this.length;
  if (length < 1) {
    return this.substr(0,width);
  }

  return (String.repeat(pad,length) + this).substr(0,width);
}

String.prototype.padRight = function(width, pad) {
  if (!width || width < 1) {
    return this;
  }

  if (!pad) {
    pad=" ";
  }

  var length = width - this.length
  if (length < 1) {
    this.substr(0,width);
  }
  return (this + String.repeat(pad,length)).substr(0,width);
};

String.prototype.toDate = function(hourOffset) {
  var re;
  // date + hour minute
  if (re = this.match(/^(\d{4})(-|\s)*(\d{2})(-|\s)*(\d{2})(\s)*(\d{2})(:)*(\d{2})/)) {
  }
  // date + hour
  else if (re = this.match(/^(\d{4})(-|\s)*(\d{2})(-|\s)*(\d{2})(\s)*(\d{2})/)) {
  }
  // date only
  else if (re = this.match(/^(\d{4})(-|\s)*(\d{2})(-|\s)*(\d{2})/)) {
  }
  // month only
  else if (re = this.match(/^(\d{4})(-|\s)*(\d{2})/)) {
  }
  date = new Date(re[1], re[3] - 1, (re[5] || 1), (re[7] || 0), (re[9] || 0));
  if (hourOffset) {
    date = date.offsetHours(hourOffset);
  }
  return date
}

String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
}

Number.humanize = function(number) {
  number = String(number);
  var x = number.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};

Array.prototype.last = function() {
  return this[this.length - 1];
}

