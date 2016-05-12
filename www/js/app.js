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
            sessionStorage.setItem('courseId',id);
            window.location='settings.html';
        },
        getCourseSetting:function(){
            var courseId=sessionStorage.getItem('courseId');
            $.ajax({
                url: mainSiteURL + "course/"+courseId,
                type: 'get',
                success: function (data) {
                    data=JSON.parse(data);
                    $('#courseNumber').html(data.course_number);
                    $('#courseTitle').html(data.course_title);
                    var coursework=JSON.parse(data.coursework).coursework;
                    var grade=JSON.parse(data.coursework).grade;
                    sessionStorage.setItem('coursework',coursework);
                    sessionStorage.setItem('grade',grade);
                    sessionStorage.setItem('course_description',data.course_description);
                    $('#homework_points').val(coursework.homework.points);
                    $('#homeworkPoint').html(coursework.homework.points);

                    $('#homework_scale').val(coursework.homework.percent).slider("refresh");
                    $('#homeworkPercent').html(coursework.homework.percent+'%');

                    $('#labs_points').val(coursework.labs.points);
                    $('#labsPoint').html(coursework.labs.points);

                    $('#labs_scale').val(coursework.labs.percent).slider("refresh");
                    $('#labsPercent').html(coursework.labs.percent+'%');

                    $('#project_points').val(coursework.project.points);
                    $('#projectPoint').html(coursework.project.points);

                    $('#project_scale').val(coursework.project.percent).slider("refresh");
                    $('#projectPercent').html(coursework.project.percent+'%');

                    $('#presentation_points').val(coursework.presentation.points);
                    $('#presentationPoint').html(coursework.presentation.points);

                    $('#presentation_scale').val(coursework.presentation.percent).slider("refresh");
                    $('#presentationPercent').html(coursework.presentation.percent+'%');

                    $('#midterm_points').val(coursework.midterm.points);
                    $('#midtermPoint').html(coursework.midterm.points);

                    $('#midterm_scale').val(coursework.midterm.percent).slider("refresh");
                    $('#midtermPercent').html(coursework.midterm.percent+'%');

                    $('#final_points').val(coursework.final.points);
                    $('#finalPoint').html(coursework.final.points);

                    $('#final_scale').val(coursework.final.percent).slider("refresh");
                    $('#finalPercent').html(coursework.final.percent+'%');

                    $('#aGrade').html(grade.A.min+'-'+grade.A.max+'%');
                    $('#bGrade').html(grade.B.min+'-'+grade.B.max+'%');
                    $('#cGrade').html(grade.C.min+'-'+grade.C.max+'%');
                    $('#dGrade').html(grade.D.min+'-'+grade.D.max+'%');
                    $('#fGrade').html(grade.F.min+'-'+grade.F.max+'%');


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
        }


    }


}();