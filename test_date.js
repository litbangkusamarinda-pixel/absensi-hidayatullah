function parseDateSafe(val) {
  if (val instanceof Date) {
    return "DATE_OBJ";
  }
  if (typeof val === 'string' && val !== "") {
    var ds = val.substring(0, 10).trim();
    if (ds.indexOf("/") !== -1) {
      var parts = ds.split("/");
      if (parts.length === 3) {
        var p0 = parts[0].length === 1 ? '0' + parts[0] : parts[0];
        var p1 = parts[1].length === 1 ? '0' + parts[1] : parts[1];
        var p2 = parts[2];
        if (p2.length === 4) {
          if (parseInt(p0) <= 12 && parseInt(p1) > 12) {
            return p2 + "-" + p0 + "-" + p1;
          } else {
            return p2 + "-" + p1 + "-" + p0;
          }
        }
      }
    } else if (ds.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return ds;
    }
    var parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      return "NEW_DATE_SUCCESS: " + parsed.toISOString();
    } else {
        return "NEW_DATE_FAILED";
    }
  }
  return val;
}

console.log("8/3/2026 6:18:17 ->", parseDateSafe("8/3/2026 6:18:17"));
console.log("03/08/2026 7:48:55 ->", parseDateSafe("03/08/2026 7:48:55"));
