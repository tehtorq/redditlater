var Linky;
Linky = (function() {
  function Linky() {}
  return Linky;
})();
Linky.parse = function(url) {
  var temp_url, type;
  type = void 0;
  url = url.unescapeHTML();
  if ((url.indexOf('.jpg') >= 0) || (url.indexOf('.jpeg') >= 0) || (url.indexOf('.png') >= 0) || (url.indexOf('.gif') >= 0) || (url.indexOf('.bmp') >= 0)) {
    type = 'image';
  } else if (url.indexOf('http://www.youtube.com/') >= 0) {
    type = 'youtube_video';
  } else {
    if (((url.indexOf('http://i.imgur.com/') === 0) || (url.indexOf('http://imgur.com/') === 0)) && (url.lastIndexOf('/') < 20)) {
      if (url.indexOf('imgur.com/a/') !== -1) {
        type = 'web';
      } else {
        type = 'image';
        if (url.indexOf('?') >= 0) {
          url = url.replace('?', '.jpg?');
        } else {
          url += '.jpg';
        }
      }
    } else {
      type = 'web';
      temp_url = url.replace(/^http\:\/\//i, "");
      temp_url = temp_url.replace(/^www\./i, "");
      temp_url = temp_url.replace(/^reddit\.com/i, "");
      temp_url = temp_url.replace(/^file\:\/\//i, "");
      if (temp_url.indexOf('/r/') === 0) {
        temp_url = temp_url.replace(/^\/r\//i, "");
        temp_url = temp_url.replace(/\//, "");
        return {
          type: type,
          url: url,
          subtype: 'reddit',
          reddit: temp_url
        };
      }
    }
  }
  return {
    type: type,
    url: url,
    subtype: 'none'
  };
};