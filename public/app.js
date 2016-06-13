$(document).ready(function() {
  $('#main').hide();
  $('#launch').click(function() {
    $('#main').show();
    $('#launch').hide();
  });

  $.getJSON('/articles', function(data) {
    var articles = data,
      counter = 0;

    $('#saveNote').attr('data-id', articles[counter]._id);
    $('#deleteNote').attr('data-id', articles[counter]._id);
    $('#articles').append("<h3>"+articles[counter].title+"</h3><p>"+articles[counter].summary+"</p>");
    $.ajax({
      method: "POST",
      dataType: "json",
      url: "/notes",
      data: {
        _id: articles[counter].note
      }
    })
      .done(function(data) {
        $('#deleteNoteBox').text(data.body);
      });


    $('#nextArticle').click(function(){
      $('#articles').empty();
      $('#deleteNoteBox').empty();
      counter = (counter + 1)%articles.length;
      $('#articles').append("<h3>"+articles[counter].title+"</h3><p>"+articles[counter].summary+"</p>");
      $('#saveNote').attr('data-id', articles[counter]._id);
      $('#deleteNote').attr('data-id', articles[counter]._id);
      $.ajax({
        method: "POST",
        dataType: "json",
        url: "/notes",
        data: {
          _id: articles[counter].note
        }
      })
        .done(function(result) {
          $('#deleteNoteBox').text(result.body);
        });
    });

    $('#previousArticle').click(function(){
      $('#articles').empty();
      $('#deleteNoteBox').empty();
      counter = (counter - 1)%articles.length;
      $('#articles').append("<h3>"+articles[counter].title+"</h3><p>"+articles[counter].summary+"</p>");
      $('#saveNote').attr('data-id', articles[counter]._id);
      $('#deleteNote').attr('data-id', articles[counter]._id);
      $.ajax({
        method: "POST",
        dataType: "json",
        url: "/notes",
        data: {
          _id: articles[counter].note
        }
      })
        .done(function(data) {
          $('#deleteNoteBox').text(data.body);
        });
    });

    $('#saveNote').click(function(){
      var thisId = $(this).attr('data-id');
      var body = $('#bodyinput').val();

      $.ajax({
        method: "POST",
        dataType: "json",
        url: "/articles/" + thisId,
        data: {
          body: body
        }
      })
        .done(function(data) {
          console.log("- SAVE NOTE -");
          console.log(data);
          $('#deleteNoteBox').text(data.body);
        });

      $('#bodyinput').val("");
    });

    $('#deleteNote').click(function(){
      var thisId = $(this).attr('data-id');

      $.ajax({
        method: "POST",
        dataType: "json",
        url: "/notes/delete/",
        data: {
          _id: thisId
        }
      })
        .done(function(data) {
          console.log("- DELETE NOTE -");
          console.log(data);
          $('#deleteNoteBox').val("");
        });

      $('#bodyinput').val("");
    });

  });

});
