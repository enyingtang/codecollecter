function replaceLazyImg() {
  var replaceImgx = document.getElementsByTagName('img');
  [].forEach.call(replaceImgx, function(m, index) {
    var dsrc = m.getAttribute('data-src');
    if (dsrc) {
      m.src = dsrc;
    }
  })
}
replaceLazyImg();
