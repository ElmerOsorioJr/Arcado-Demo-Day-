 var thumbUp = document.getElementsByClassName("thumbsUp");
var trash = document.getElementsByClassName("trash");
var pin = document.getElementsByClassName("pin");

Array.from(pin).forEach(function(element) {
      element.addEventListener('click', function(){
        const imagePath = this.parentNode.parentNode.childNodes[3].pathname
        console.log(imagePath)
        fetch('pin', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          pinnedImage: imagePath
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
      .then(data => {
          // window.location.reload(true)
        })

      });
});

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const caption = this.parentNode.parentNode.childNodes[5].innerText
        console.log(caption)
        let _id = this.parentNode.childNodes[9].dataset.id
        console.log(_id)
        const likes = parseFloat(this.parentNode.childNodes[1].innerText)
        console.log(this.parentNode.childNodes)

        if(likes < 1){
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
      }
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log('hello')
        const post = this.parentNode.parentNode.childNodes[5].innerText
        console.log(post)
        const likes = parseFloat(this.parentNode.childNodes[1].innerText)
        console.log(likes)
        let pathName = this.parentNode.parentNode.childNodes[3].pathname
        console.log(pathName)
        let posterId= this.parentNode.childNodes[11].dataset.id
        console.log(posterId)
        let _id = this.parentNode.childNodes[9].dataset.id
        // console.log(_id)
        // const imgPath =
        // const _id =

        fetch('deletePost', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'posterId' : posterId,
            'pathName': pathName,
            'likes': likes,
            'post': post,
            '_id': _id
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
