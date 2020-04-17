var thumbUp = document.getElementsByClassName("thumbsUp");
console.log('feeeed')
// //
Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log(this.parentNode.childNodes)
        const caption = this.parentNode.parentNode.childNodes[5].innerText
        console.log(caption)
        let _id = this.parentNode.childNodes[5].dataset.id
        console.log(_id)
        const likes = parseFloat(this.parentNode.childNodes[1].innerText)
        console.log(likes)
        
        fetch('likePicture', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            '_id' : _id,
            'caption' : caption,
            'likes' : likes
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          window.location.reload(true)
        })
      });
});
