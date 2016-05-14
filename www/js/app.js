/**
 * Created by omkargudekar on 5/7/16.
 */

var studentListURL = "http://getmyshop.org/grade/";
var courseListURL = "http://publicvoid.net/grade/";


var GRADE_CALC = function () {

    return {
        gradeCalcFun: function () {

            var coursework = JSON.parse(sessionStorage.getItem('coursework'));
            var grade = JSON.parse(sessionStorage.getItem('grade'));
            var obtainedGrade;


            if (Number($('#homework').val()) > Number(coursework.homework.points) || Number(($('#labs').val()) > Number(coursework.labs.points)) || Number($('#presentation').val()) > Number(coursework.presentation.points) || Number($('#project').val()) > Number(coursework.project.points) || Number($('#midterm').val()) > Number(coursework.midterm.points) || Number($('#final').val()) > Number(coursework.final.points)) {
                $('.result').html('Invalid Marks').css({
                    color: "red"
                });
            }
            else {

                var totalPer = (((($('#homework').val() / coursework.homework.points)) * coursework.homework.percent)) +
                    (((($('#labs').val() / coursework.labs.points)) * coursework.labs.percent)) +
                    (((($('#presentation').val() / coursework.presentation.points)) * coursework.presentation.percent)) +
                    (((($('#project').val() / coursework.project.points)) * coursework.project.percent)) +
                    (((($('#midterm').val() / coursework.midterm.points)) * coursework.midterm.percent)) +
                    (((($('#final').val() / coursework.final.points)) * coursework.final.percent));


                if (totalPer >= grade.A.min) {
                    obtainedGrade = "A";
                }
                else if (totalPer >= grade.B.min) {
                    obtainedGrade = "B";
                }
                else if (totalPer >= grade.C.min) {
                    obtainedGrade = "C";
                }
                else if (totalPer >= grade.D.min) {
                    obtainedGrade = "D";
                }
                else {
                    obtainedGrade = "F";
                }


                var data = {};
                data.course_id = sessionStorage.getItem('courseId');
                data.grade = obtainedGrade;
                data.student_id = $('#students option:selected').val();

                $.ajax({
                    url: courseListURL + "performance",
                    type: 'post',
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: function (data) {

                        $('.result').html('Grade : ' + obtainedGrade + '. Saved in database.').css({
                            color: 'green'
                        });
                    }
                });
            }


        },
        validateRange: function () {

            var validate = false;
            if ($('#a-rangeb').val() < 101 && $('#a-rangea').val() == $('#b-rangeb').val() && $('#b-rangea').val() == $('#c-rangeb').val() && $('#c-rangea').val() == $('#d-rangeb').val() && $('#d-rangea').val() == $('#f-rangeb').val() ) {

                if (( Number($('#homework_scale').val()) + Number($('#labs_scale').val()) + Number($('#project_scale').val()) + Number($('#presentation_scale').val()) + Number($('#midterm_scale').val()) + Number($('#final_scale').val())) == 100) {

                    validate = true;
                    $('span.grade-result').html('');
                    $('.grade-head').css({
                        "background-color": '#673AB7'
                    });
                    $('span.ratio-result').html('');
                    $('.ratio-head').css({
                        "background-color": '#673AB7'
                    });
                }
                else {
                    $('span.ratio-result').html(': Invalid Ratio');
                    $('.ratio-head').css({
                        "background-color": 'red'
                    });
                }

            }
            else {
                $('span.grade-result').html(': Invalid Range');
                $('.grade-head').css({
                    "background-color": 'red'
                });
            }


            return validate;

        },
        login: function () {

            var loginRequest = {};
            loginRequest.username = $('#username').val();
            loginRequest.password = $('#password').val();

            $.ajax({
                url: courseListURL + "login",
                type: 'post',
                dataType: "json",
                data: JSON.stringify(loginRequest),
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.status == 200) {
                        $('.invalid-login').html('');
                        window.location = "courses.html";
                    }
                },
                error: function (data) {
                    $('.invalid-login').html('Invalid Credentials');
                    // alert('Invalid Login');

                }
            });

        },
        getCourseDropDownList: function () {

            $.ajax({
                url: courseListURL + "courses",
                type: 'get',
                success: function (data) {
                    data = JSON.parse(data).courses;

                    for (var counter = 0; counter < data.length; counter++) {
                        try {

                            $("#courses").append('<option value= ' + data[counter].course_id + '>' +
                                data[counter].course_number + ' ' + data[counter].course_title + ' | ' + data[counter].course_instructor +
                                '</option>');
                            GRADE_CALC.generatePerformanceChart();

                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    $('#courses').selectmenu('refresh');
                }
            });
        },
        getStudentDropDownList: function () {

            $.ajax({
                url: studentListURL + "students",
                type: 'get',
                success: function (data) {
                    data = JSON.parse(data).students;

                    for (var counter = 0; counter < data.length; counter++) {
                        try {
                            $("#students").append('<option value= ' + data[counter].student_id + '>' +
                                data[counter].student_id + ' | ' + data[counter].student_fname + ' , ' + data[counter].student_lname +
                                '</option>');
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    $('#students').selectmenu('refresh');


                }
            });
        },
        getGradeSettings: function () {


            $.ajax({
                url: courseListURL + "course/" + sessionStorage.getItem('courseId'),
                type: 'get',
                success: function (data) {
                    data = JSON.parse(data);
                    console.log(data);
                    var coursework = JSON.parse(data.coursework).coursework;
                    var grade = JSON.parse(data.coursework).grade;

                    sessionStorage.setItem('coursework', JSON.stringify(coursework));
                    sessionStorage.setItem('grade', JSON.stringify(grade));

                    $('#homework_points').html(coursework.homework.points);

                    $('#labs_points').html(coursework.labs.points);

                    $('#project_points').html(coursework.project.points);

                    $('#presentation_points').html(coursework.presentation.points);

                    $('#midterm_points').html(coursework.midterm.points);

                    $('#final_points').html(coursework.final.points);

                    GRADE_CALC.getStudentDropDownList();

                }
            });
        },
        getCourses: function () {

            $.ajax({
                url: courseListURL + "courses",
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

                    $('#courseList').listview('refresh');
                }
            });
        },
        getCoursesForGrade: function () {

            $.ajax({
                url: courseListURL + "courses",
                type: 'get',
                success: function (data) {
                    data = JSON.parse(data).courses;

                    for (var counter = 0; counter < data.length; counter++) {
                        try {

                            $("#courseList").append('<li> ' +
                                '<a href="#" onclick="GRADE_CALC.goCourseGradeHome(' + data[counter].course_id + ')">' +
                                '<span class="course-number">' + data[counter].course_number +
                                '</span>' + data[counter].course_title +
                                '</a>' +
                                '</li>');
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }

                    $('#courseList').listview('refresh');
                }
            });
        },
        addNewCourse: function () {

            var data = {}
            data.course_number = $('#newCourseNumber').val();
            data.course_title = $('#newCourseTitle').val();
            data.course_instructor = $('#newInstructor').val();


            $.ajax({
                url: courseListURL + "course",
                type: 'post',
                dataType: "json",
                data: JSON.stringify(data),
                success: function (data) {

                    // alert('New course added');
                    GRADE_CALC.goCourseHome(data.id);
                },
                error: function () {
                    // alert('Failed to add new course.');
                }
            });


        },
        goCourseGradeHome: function (id) {
            sessionStorage.setItem('courseId', id);
            window.location = 'grade.html';
        },
        goCourseHome: function (id) {
            sessionStorage.setItem('courseId', id);
            window.location = 'settings.html';
        },
        getCourseSetting: function () {
            var courseId = sessionStorage.getItem('courseId');
            $.ajax({
                url: courseListURL + "course/" + courseId,
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


            if (GRADE_CALC.validateRange()) {
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
                    url: courseListURL + "course/" + sessionStorage.getItem('courseId'),
                    type: 'post',
                    dataType: "json",
                    data: JSON.stringify(data),
                    success: function () {

                        // alert('Course Setting Updated.');
                        $('.ui-popup').popup('close');
                        GRADE_CALC.getCourseSetting();

                    },
                    error: function () {
                        // alert('Failed to update course setting.');
                        $('.ui-popup').popup('close');


                    }
                });


            }


        },
        getStudents: function () {


            $.ajax({
                url: studentListURL + "students",
                type: 'get',
                success: function (data) {
                    data = JSON.parse(data).students;

                    for (var counter = 0; counter < data.length; counter++) {
                        try {
                            $("#studentList").append('' +
                                ' <li class="student-details">' +
                                '<a> ' +
                                '<img src="' + data[counter].student_image + '"> ' +
                                '<h2 class="">' +
                                '<i class="fa fa-user" aria-hidden="true"></i> ' + data[counter].student_fname + ',' + data[counter].student_lname + ' </h2>' +
                                ' <p>' + data[counter].student_id + ' | ' +
                                '<i class="fa fa-phone" aria-hidden="true"></i>  ' + data[counter].student_contact +
                                ' </p><p><i class="fa fa-envelope-o" aria-hidden="true"></i> ' + data[counter].student_email +
                                '</p></a> </li>');
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }

                    $('#studentList').listview('refresh');
                }
            });

        },
        generatePerformanceChart: function () {


            var id = $('#courses option:selected').val();
            $.ajax({
                url: courseListURL + "performance/" + id,
                type: 'get',
                success: function (data) {
                    data = JSON.parse(data)[0];

                    console.log(data);
                    var ajaxData = [
                        ['A', parseInt(data.A)],
                        ['B', parseInt(data.B)],
                        ['C', parseInt(data.C)],
                        ['D', parseInt(data.D)],
                        ['F', parseInt(data.F)]

                    ];
                    console.log(ajaxData);
                    $('#chart').highcharts({
                        chart: {
                            type: 'pie',
                            options3d: {
                                enabled: true,
                                alpha: 45,
                                beta: 0
                            },
                            backgroundColor: 'transparent',
                        },
                        credits: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                depth: 25,
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name} [ {point.percentage:.1f}% ]'
                                }
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: 'Grade Distribution',
                            data: ajaxData
                        }]
                    });
                }
            });
        }

    }


}();