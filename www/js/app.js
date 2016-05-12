/**
 * Created by omkargudekar on 5/7/16.
 */

var studentListURL = "http://localhost:8080/";
var courseListURL = "http://localhost:8080/";
var mainSiteURL = "http://localhost:8080/";


var GRADE_CALC = function () {

    return {

        login: function () {

            var loginRequest = {};
            loginRequest.username = $('#username').val();
            loginRequest.password = $('#password').val();

            $.ajax({
                url: mainSiteURL + "login",
                type: 'post',
                dataType: "json",
                data: JSON.stringify(loginRequest),
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.status == 200) {
                        window.location = "courses.html";
                    }
                    else {
                        alert('Invalid Login');
                    }
                }
            });

        },
        getCourses: function () {

            $.ajax({
                url: mainSiteURL + "courses",
                type: 'get',
                success: function (data) {
                    data = JSON.parse(data).courses;

                    for (var counter = 0; counter < data.length; counter++) {
                        try {

                            $("#courseList").append('<li> ' +
                                '<a href="#" onclick="GRADE_CALC.goCourseHome(' + data[counter].course_id + ')">' +
                                '<span class="course-number">' + data[counter].course_number +
                                '</span>' + data[counter].course_title +
                                '</a>' +
                                '</li>');
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    ;
                    $('#courseList').listview('refresh');
                }
            });
        },
        goCourseHome: function (id) {
            sessionStorage.setItem('courseId', id);
            window.location = 'settings.html';
        },
        getCourseSetting: function () {
            var courseId = sessionStorage.getItem('courseId');
            $.ajax({
                url: mainSiteURL + "course/" + courseId,
                type: 'get',
                success: function (data) {
                    data = JSON.parse(data);
                    $('#courseNumber').html(data.course_number);
                    $('#courseTitle').html(data.course_title);
                    var coursework = JSON.parse(data.coursework).coursework;
                    var grade = JSON.parse(data.coursework).grade;

                    sessionStorage.setItem('coursework', JSON.stringify(coursework));
                    sessionStorage.setItem('grade', JSON.stringify(grade));
                    sessionStorage.setItem('course_description', data.course_description);
                    $('#homework_points').val(coursework.homework.points);
                    $('#homeworkPoint').html(coursework.homework.points);

                    $('#homework_scale').val(coursework.homework.percent).slider("refresh");
                    $('#homeworkPercent').html(coursework.homework.percent + '%');

                    $('#labs_points').val(coursework.labs.points);
                    $('#labsPoint').html(coursework.labs.points);

                    $('#labs_scale').val(coursework.labs.percent).slider("refresh");
                    $('#labsPercent').html(coursework.labs.percent + '%');

                    $('#project_points').val(coursework.project.points);
                    $('#projectPoint').html(coursework.project.points);

                    $('#project_scale').val(coursework.project.percent).slider("refresh");
                    $('#projectPercent').html(coursework.project.percent + '%');

                    $('#presentation_points').val(coursework.presentation.points);
                    $('#presentationPoint').html(coursework.presentation.points);

                    $('#presentation_scale').val(coursework.presentation.percent).slider("refresh");
                    $('#presentationPercent').html(coursework.presentation.percent + '%');

                    $('#midterm_points').val(coursework.midterm.points);
                    $('#midtermPoint').html(coursework.midterm.points);

                    $('#midterm_scale').val(coursework.midterm.percent).slider("refresh");
                    $('#midtermPercent').html(coursework.midterm.percent + '%');

                    $('#final_points').val(coursework.final.points);
                    $('#finalPoint').html(coursework.final.points);

                    $('#final_scale').val(coursework.final.percent).slider("refresh");
                    $('#finalPercent').html(coursework.final.percent + '%');

                    $('#aGrade').html(grade.A.min + '-' + grade.A.max + '%');
                    $('#bGrade').html(grade.B.min + '-' + grade.B.max + '%');
                    $('#cGrade').html(grade.C.min + '-' + grade.C.max + '%');
                    $('#dGrade').html(grade.D.min + '-' + grade.D.max + '%');
                    $('#fGrade').html(grade.F.min + '-' + grade.F.max + '%');


                    $('#a-rangea').val(grade.A.min).slider("refresh");
                    $('#a-rangeb').val(grade.A.max).slider("refresh");
                    $('#b-rangea').val(grade.B.min).slider("refresh");
                    $('#b-rangeb').val(grade.B.max).slider("refresh");
                    $('#c-rangea').val(grade.C.min).slider("refresh");
                    $('#c-rangeb').val(grade.C.max).slider("refresh");
                    $('#d-rangea').val(grade.D.min).slider("refresh");
                    $('#d-rangeb').val(grade.D.max).slider("refresh");
                    $('#f-rangea').val(grade.F.min).slider("refresh");
                    $('#f-rangeb').val(grade.F.max).slider("refresh");


                    $('#description').html(data.course_description);
                    tinyMCE.activeEditor.setContent(data.course_description);

                }
            });
        },
        saveSettings: function () {

            tinyMCE.triggerSave();
            var coursework = JSON.parse(sessionStorage.getItem('coursework'));
            var grade = JSON.parse(sessionStorage.getItem('grade'));

            //updated grade

            grade.A.min = $('#a-rangea').val();
            grade.A.max = $('#a-rangeb').val();
            grade.B.min = $('#b-rangea').val();
            grade.B.max = $('#b-rangeb').val();
            grade.C.min = $('#c-rangea').val();
            grade.C.max = $('#c-rangeb').val();
            grade.D.min = $('#d-rangea').val();
            grade.D.max = $('#d-rangeb').val();
            grade.F.min = $('#f-rangea').val();
            grade.F.max = $('#f-rangeb').val();




            //updated coursework

            coursework.homework.points = $('#homework_points').val();

            coursework.homework.percent = $('#homework_scale').val();

            coursework.labs.points = $('#labs_points').val();

            coursework.labs.percent = $('#labs_scale').val();

            coursework.project.points = $('#project_points').val();

            coursework.project.percent = $('#project_scale').val();

            coursework.presentation.points = $('#presentation_points').val();

            coursework.presentation.percent = $('#presentation_scale').val();

            coursework.midterm.points = $('#midterm_points').val();

            coursework.midterm.percent = $('#midterm_scale').val();

            coursework.final.points = $('#final_points').val();

            coursework.final.percent = $('#final_scale').val();

            var data = {};
            var grades = {};
            grades.coursework = coursework;
            grades.grade = grade;

            data.coursework = JSON.stringify(grades);
            data.course_description = tinyMCE.activeEditor.getContent();
            //NOTE SLIM FRAMEWORK ISSUE : PUT DOESNT WORK , THORUGH POSTMAN WORKS
            $.ajax({
                url: mainSiteURL + "course/"+sessionStorage.getItem('courseId'),
                type: 'post',
                dataType: "json",
                data: JSON.stringify(data),
                success: function () {

                    alert('Course Setting Updated.');
                    GRADE_CALC.getCourseSetting();

                },
                error:function(){
                    alert('Failed to update course setting.');
                }
            });

        }


    }


}();