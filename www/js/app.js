/**
 * Created by omkargudekar on 5/7/16.
 */

var studentListURL = "http://localhost:8080/";
var courseListURL = "http://localhost:8080/";
var mainSiteURL = "http://localhost:8080/";


$(document).on("pagecreate", function () {
    $(".fullscreen-popup").popup({
        beforeposition: function () {
            $(this).css({
                width: window.innerWidth,
                height: window.innerHeight - 14
            });
        },
        x: 0,
        y: 0
    });
});

var GRADE_CALC = function () {

    return {

        login: function () {

            var loginRequest = {};
            loginRequest.username=$('#username').val();
            loginRequest.password=$('#password').val();

            $.ajax({
                url: mainSiteURL + "login",
                type: 'post',
                dataType: "json",
                data: JSON.stringify(loginRequest),
                success: function (data) {
                    data=JSON.parse(data);
                    if (data.status == 200) {
                        window.location = "courses.html";
                    }
                    else {
                        alert('Invalid Login');
                    }
                }
            });

        },
        getCourses:function(){

            $.ajax({
                url: mainSiteURL + "courses",
                type: 'get',
                success: function (data) {
                    data=JSON.parse(data).courses;

                    for (var counter = 0; counter < data.length; counter++) {
                        try {

                            $("#courseList").append('<li> ' +
                                '<a href="#" onclick="GRADE_CALC.goCourseHome('+data[counter].course_id+')">' +
                                '<span class="course-number">' +data[counter].course_number+
                                '</span>' +data[counter].course_title+
                                '</a>' +
                                '</li>');
                        }
                        catch (err) {
                            console.log(err);
                        }
                    };
                    $('#courseList').listview('refresh');
                }
            });
        },
        goCourseHome:function(id){
            alert(id);
        }


    }


}();