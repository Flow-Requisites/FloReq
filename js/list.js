$( document ).ready(function () {

    $('#prog-input').on('input', function() {
        if ($("#prog-input")[0].value == "Computer Traditional" && $("#uni-input")[0].value == "University of Alberta") {
            renderList(0);
        }
        if ($("#prog-input")[0].value == "Electrical Traditional" && $("#uni-input")[0].value == "University of Alberta") {
            renderList(1);
        }
    });

    $('#uni-input').on('input', function() {
        if ($("#prog-input")[0].value == "Computer Traditional" && $("#uni-input")[0].value == "University of Alberta") {
            renderList(0);
        }
        if ($("#prog-input")[0].value == "Electrical Traditional" && $("#uni-input")[0].value == "University of Alberta") {
            renderList(1);
        }
    });

    $('input').on('click', function() {
        $(this).attr('placeholder',$(this).val());
      $(this).val('');
    });
    $('input').on('mouseleave', function() {
      if ($(this).val() == '') {
        $(this).val($(this).attr('placeholder'));
      }
    });

    function renderList(num) {
        d3.json("../data.json", function(error, data) {
            var courses = data.department[num].specialization[0].children;
            $('ul').remove();
            $('.course-list').append('<ul/>');
            $.each(courses, function() {
                var list = $('.course-list ul'),
                    listItem = $('<li class="course-list-item"/>'),
                    html = listItem.append($('<p/>').text(this.name));
                list.append(html);
                listItem.mouseover(function() {
                    console.log(this);
                });
            });
        });
    }
});