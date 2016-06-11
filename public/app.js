$(document).ready(function() {
  $('#main').hide();
  $('#launch').on('click', function() {
    $('#main').show();
    $('#launch').hide();
  });

  $.getJSON('/articles', function(data) {
    var articles = data,
      counter = 0;

    $('#saveNote').attr('data-id', articles[counter]._id);
    $('#articles').append("<h3>"+articles[counter].title+"</h3><p>"+articles[counter].summary+"</p>");


    $('#nextArticle').click(function(){
      $('#articles').empty();
      counter = (counter + 1)%articles.length;
      $('#articles').append("<h3>"+articles[counter].title+"</h3><p>"+articles[counter].summary+"</p>");
      $('#saveNote').attr('data-id', articles[counter]._id);
      $.ajax({
        method: "POST",
        dataType: "json",
        url: "/notes/" + articles[counter].note,
        data: {
          id: articles[counter].note
        }
      })
        .done(function(data) {
          console.log("data ---> "+data);
        });
    });
    $('#previousArticle').click(function(){
      $('#articles').empty();
      counter = (counter - 1)%articles.length;
      $('#articles').append("<h3>"+articles[counter].title+"</h3><p>"+articles[counter].summary+"</p>");
      $('#saveNote').attr('data-id', articles[counter]._id);

    });



  });


  $(document).on('click', '#saveNote', function(){
    var thisId = $(this).attr('data-id');
    var body = $('#bodyinput').val();
    console.log("This is the article ID: "+thisId);

    $.ajax({
      method: "POST",
      dataType: "json",
      url: "/articles/" + thisId,
      data: {
        body: body
      }
    })
      .done(function(data) {
        console.log(data._id);
        $('#deleteNoteBox').text(data.body);
      });

    $('#bodyinput').val("");

  // //get note where note._id = articles.note

  });

});
