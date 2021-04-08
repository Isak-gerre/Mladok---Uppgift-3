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
  baseArray: STUDENTS,
  filterKey: "lastName",
  filterLabelName: "Search Students By Last Name",
  filterLabelKey: "lastName",
  DOMCreator: function () {
    document.querySelector(".listContainer").innerHTML = " ";
    let array = [];
    let arrayOfStudents = STUDENTS.filter((name) => name.lastName.toUpperCase().includes(this.filterLabelKey));
    arrayOfStudents.sort((a, b) => (a.lastName < b.lastName ? -1 : 1));
    arrayOfStudents.forEach((obj) => array.push(DOMStudent(obj)));
    array.forEach((obj) => document.querySelector(".listContainer").append(obj));
  },
};
main.prepend(DOMFilter(data));

// Här kodar du funktionen som ska skapa DOM-elementet för varje student.
// Se videon för detaljer om vad som ska ingå i elementet.
// DOMStudent:
// 1) Tar emot ett argument som är ett av objekten i STUDENTS
// 2) Returnerar ett DOM-element som placeras i .listContainer (det gör DOMFilter)
function DOMStudent(student) {
  let container = document.createElement("div");
  container.classList.add("student");

  // We add information through functions to make the code more readable.
  // In order to organise the code we declare the functions
  // inside DOMCourse, since they will only be called from inside DOMCourse.

  // Add Name
  container.append(studentName(student));

  // Add Courses
  container.append(studentCourses(student.courses));

  return container;

  // We can put these declarations after the return because they are function declarations,
  // not "normal" executable code. "Normal" executable code is not executed
  // if it is placed after a return instruction.

  function studentName(student) {
    let studentID = STUDENTS.find((obj) => obj.lastName == student.lastName).studentID;
    let names = document.createElement("p");
    names.textContent = `${student.firstName} ${student.lastName} (total: ${calcCredits(studentID)} credits)`;
    return names;
  }

  function studentCourses(coursesArray) {
    let coursesDiv = document.createElement("div");
    let coursesIDs = [];
    coursesArray.forEach((obj) =>
      coursesIDs.push({
        id: obj.courseID,
        passedCredits: obj.passedCredits,
        start: obj["started"],
      })
    );
    let courseCards = createCourseCard(coursesIDs);
    coursesDiv.classList.add("studentCourses");
    coursesDiv.innerHTML = "<p>Courses: </p>";
    coursesDiv.append(courseCards);
    return coursesDiv;
  }
}
function createCourseCard(courseIDs) {
  courseIDs.sort((a, b) => (a.start.year < b.start.year ? -1 : 1));

  let courseCards = document.createElement("div");
  courseIDs.forEach((course) => {
    let card = document.createElement("div");
    card.classList.add("course-card");

    let title = document.createElement("p");
    title.classList.add("course-title");
    title.innerText = COURSES.find((obj) => obj.courseID === course.id).title;
    card.append(title);

    let description = document.createElement("p");
    description.classList.add("course-desc");
    let totalCredits = COURSES.find((obj) => obj.courseID === course.id).totalCredits;
    description.innerText = `${course.start.semester} ${course.start.year} (${course.passedCredits} of ${totalCredits})`;
    if (totalCredits == course.passedCredits) card.classList.add("finished");
    card.append(description);

    courseCards.append(card);
  });
  courseCards.classList.add("course-list");
  return courseCards;
}

function calcCredits(studentID) {
  let student = STUDENTS.find((obj) => obj.studentID == studentID);
  let credits = 0;
  student.courses.forEach(({ passedCredits }) => (credits += passedCredits));
  return credits;
}
