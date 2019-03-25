$(document).ready(function() {
  // Grab the articles as a json
  $.getJSON('/articles', function(data) {
    // Loop over the articles and populate the DOM
    data.forEach(function(article) {
      $('#articles').append(
        `<article data-id='${article._id}'>
          <img class='card_img' src='${article.photo}'/>
          <div class='card_info'>
            <h2 href='${article.link}'>${article.title}</h2>
            <p>${article.summary}</p>
            <div class="comments"></div>
          </div>
          </article>
        <hr/>`
      );
    });
  });

  // Whenever someone clicks an article tag
  $(document).on('click', 'article', function() {
    // Empty the notes from the note section
    $('#comments').empty();
    // Save the id from the article tag
    var thisId = $(this).attr('data-id');

    // Now make an ajax call for the Article
    $.ajax({
      method: 'GET',
      url: `/articles/${thisId}`,
    })
      // With that done, add the note information to the page
      .then(function(data) {
        // // The title of the article
        // $('#comments').append(`<h2>${data.title}</h2>`);
        // // An input to enter a new title
        // $('#comments').append(`<input id='titleinput' name='title' >`);
        // // A textarea to add a new note body
        // $('#comments').append(
        //   `<textarea id='bodyinput' name='body'></textarea>`
        // );
        // // A button to submit a new note, with the id of the article saved to it
        // $('#comments').append(
        //   `<button data-id='${data._id}' id='savenote'>Save Comment</button>`
        // );

        // If there's a comment in the article
        if (data.comments) {
          data.comments.forEach(function(comment) {
            $(`[data-id="${thisId}"] .comments`)
              .append(`
                <div>
                 <h4>${comment.title}</h4>
                 <p>${comment.body}</p>
                </div>`);
            // $(`data-${thisId}`).append(`<h4>${comment.title}</h4>`);
          // Place the title of the comment in the title input
          // $('#titleinput').val(comment.title);
          // Place the body of the comment in the body textarea
          // $('#bodyinput').val(comment.body);
        });
          
        }
      });
  });
});
