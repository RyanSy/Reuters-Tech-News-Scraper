$.getJSON('/articles', function(data) {
  var articles = data,
      counter = 0;
  $('#articles').append("<h3>"+data[counter].title+"</h3><br><p>"+data[counter].summary+"</p>");
  $('#nextArticle').click(function(){
    $('#articles').empty();
    counter = (counter + 1)%articles.length;
    $('#articles').append("<h3>"+data[counter].title+"</h3><br><p>"+data[counter].summary+"</p>");
  });
});

$(document).on('click', '#saveNote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $('#bodyinput').val()
    }
  })
    .done(function(data) {
      console.log("POST ROUTE TO SAVE NOTE"+data);
      $('#notes').empty();
      $('#deleteNoteBox').append(data);
    });

  $('#bodyinput').val("");



});
