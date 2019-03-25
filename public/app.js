$(document).ready(function() {
  // Grab the articles as a json
  $.getJSON('/articles', function(data) {
    // Loop over the articles and populate the DOM
    data.forEach(function(article) {
      $('#articles').append(
        `<article data-id='${article._id}'>${article.title}<br/>${article.link}<br/>${article.photo}<br/>${article.summary}</article><br/><hr/>`
      );
    });
  });

  // Whenever someone clicks an article tag
$(document).on("click", "article", function() {
  // Empty the notes from the note section
  $("#comments").empty();
  // Save the id from the article tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: `/articles/${thisId}`
  })
    // With that done, add the note information to the page
    .then(function(data) {
      data.comments.forEach(function(articleId){
        console.log('the article is ', articleId)
      })
      // The title of the article
      $("#comments").append(`<h2>${data.title}</h2>`);
      // An input to enter a new title
      $("#comments").append(`<input id='titleinput' name='title' >`);
      // A textarea to add a new note body
      $("#comments").append(`<textarea id='bodyinput' name='body'></textarea>`);
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append(`<button data-id='${data._id}' id='savenote'>Save Comment</button>`);

      // If there's a comment in the article
      if (data.comment) {
        // Place the title of the comment in the title input
        $("#titleinput").val(data.comment.title);
        // Place the body of the comment in the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
});

});
