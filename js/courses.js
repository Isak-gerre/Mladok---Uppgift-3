"use strict";

// Add specific <head> stuff
// Here's where you add <link> and <title>, specific to this page
// FYLL_I_HÄR_RÄTT_KOD

// Add Elements in main
const main = document.querySelector("main");

// Add the list (before the filter because wee need it so the filter
// knows where to append the list elements)
main.innerHTML = `
    <div class="listContainer"></div>
`;

// ===============
// Append Filter (place it before the list)
// Läs vad som står på commonElements.js så du vet vilka nycklar och värden data ska ha.
// Notera att DOMFilter bara tar emot ett argument, det måste vara ett objekt med
// flera nyklar.
let data = {
  baseArray: COURSES,
  filterKey: "title",
  filterLabelName: "Search Courses By Title",
  filterLabelKey: "title",
  DOMCreator: function () {
    document.querySelector(".listContainer").innerHTML = " ";
    let array = [];
    let arrayOfCourses = COURSES.filter((course) => course.title.toUpperCase().includes(this.filterLabelKey));
    arrayOfCourses.sort((a, b) => (a.title < b.title ? -1 : 1));
    arrayOfCourses.forEach((obj) => array.push(DOMCourse(obj)));
    array.forEach((obj) => document.querySelector(".listContainer").append(obj));
  },
};
main.prepend(DOMFilter(data));

// Här kodar du funktionen som ska skapa DOM-elementet för varje kurs.
// Se videon för detaljer om vad som ska ingå i elementet.
// DOMCourse:
// 1) Tar emot ett argument som är ett av objekten i COURSES
// 2) Returnerar ett DOM-element som placeras i .listContainer (det gör DOMFilter)
function DOMCourse(course) {
  let container = document.createElement("div");
  container.classList.add("course");

  // We add information through functions to make the code more readable.
  // In order to organise the code we declare the functions
  // inside DOMCourse, since they will only be called from inside DOMCourse.

  // Add Title
  container.append(courseTitle(course));

  // Add Staff
  container.append(courseStaff(course));

  // Add Students
  container.append(courseStudents(course));

  return container;

  // We can put these declarations after the return because they are function declarations,
  // not "normal" executable code. "Normal" executable code is not executed
  // if it is placed after a return instruction.

  function courseTitle(course) {
    let title = COURSES.find((obj) => obj.title == course.title).title;
    let credits = COURSES.find((obj) => obj.title == course.title).totalCredits;
    let titleTag = document.createElement("p");
    titleTag.textContent = `${title} (${credits} credits)`;
    return titleTag;
  }

  function courseStaff(course) {
    let teachersContainer = document.createElement("div");
    teachersContainer.classList.add("teachers");
    let courseResp = document.createElement("div");
    courseResp.classList.add("courseResp");
    courseResp.innerHTML = "<p>Course Responsible</p>";
    courseResp.append(createTecherCards(course.courseResponsible));

    let courseTeachers = document.createElement("div");
    let cards = document.createElement("div");
    courseTeachers.classList.add("courseTeachers");
    courseTeachers.innerHTML = "<p>Course Teachers</p>";
    course.teachers.forEach((obj) => {
      cards.append(createTecherCards(obj));
    });
    cards.classList.add("course-list");
    courseTeachers.append(cards);
    teachersContainer.append(courseResp, courseTeachers);
    return teachersContainer;
  }

  function courseStudents(course) {
    // First find all the students that have studied this course
    let students = STUDENTS.filter((obj) => obj.courses.find((obj) => obj.courseID === course.courseID));
    // Then use the array of students that have studied the course to create
    // another array where each element is an object with the keys:
    // {firstName, lastName, passedCredits (in this course), started: {year, semester} (this course) }
    let studentArray = students.map((student) => {
      // In the object student there is information about ALL the courses she has studied.
      // We want to extract the data for one course (the one with courseID)
      // FYLL_I_HÄR_RÄTT_KOD
      let index = student.courses.findIndex((obj) => obj.courseID === course.courseID);
      return {
        firstName: student.firstName,
        lastName: student.lastName,
        passedCredits: student.courses[index].passedCredits,
        started: {
          year: student.courses[index].started.year,
          semester: student.courses[index].started.semester,
        },
      };
    });

    // Then sort the students ascending by started.year
    studentArray.sort((a, b) => (a.started.year < b.started.year ? -1 : 1));

    // Now do the DOM stuff
    let containerStudents = document.createElement("div");
    containerStudents.classList.add("student-list");
    container.append(containerStudents);

    containerStudents.innerHTML = `
            <div>Students:</div>
            <div class="list"></div>
        `;
    studentArray.forEach((student) => {
      let containerStudent = document.createElement("div");
      containerStudent.classList.add("student-card");

      if (course.totalCredits === student.passedCredits) {
        containerStudent.classList.add("finished");
      }
      containerStudent.innerHTML = `
      <p>${student.firstName} ${student.lastName} (${student.passedCredits} credits)</p>
      <p>${student.started.semester} ${student.started.year}</p>
      `;
      containerStudents.querySelector(".list").append(containerStudent);
    });

    return containerStudents;
  }
}

// Eftersom du behöver skapa Teachers i två olika platser (under Course Responsible ochunder Teachers)
// så är det enda rimliga att skapa en funktion som tar emot info om läraren och returnerar
// ett DOM-element som kan appendas på rätt ställe.
function createTecherCards(id) {
  let card = document.createElement("div");
  let fname = TEACHERS.find((obj) => obj.teacherID === id).firstName;
  let lname = TEACHERS.find((obj) => obj.teacherID === id).lastName;
  let post = TEACHERS.find((obj) => obj.teacherID === id).post;
  card.innerText = `${fname} ${lname} (${post})`;
  card.classList.add("course-card");
  return card;
}
