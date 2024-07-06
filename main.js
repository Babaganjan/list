const students = [
  {
      name: 'Иван',
      surname: 'Иванов',
      middleName: 'Иванович',
      birthDate: new Date('1995-05-12'),
      startYear: 2022,
      faculty: 'Математический'
  },

  {
      name: 'Петр',
      surname: 'Петров',
      middleName: 'Петрович',
      birthDate: new Date('1993-04-10'),
      startYear: 2013,
      faculty: 'Математический'
  },

  {
      name: 'Николай',
      surname: 'Никифоров',
      middleName: 'Иванович',
      birthDate: new Date('1991-05-08'),
      startYear: 2008,
      faculty: 'Физика-математический'
  },

  {
      name: 'Илья',
      surname: 'Иваненко',
      middleName: 'Степанович',
      birthDate: new Date('1998-08-02'),
      startYear: 2010,
      faculty: 'Исторический'
  },

  {
      name: 'Евгений',
      surname: 'Сергеев',
      middleName: 'Анатольевич',
      birthDate: new Date('1995-09-04'),
      startYear: 2014,
      faculty: 'Инженерный'
  }
]

// Функция создает новую строку студента в таблице
function renderStudentTable(filteredStudentsArr) {
  const tableBody = document.getElementById('studentTableBody');
  tableBody.innerHTML = '';
  filteredStudentsArr.forEach(student => {
      const row = document.createElement('tr');

      const fullNameCell = document.createElement('td');
      fullNameCell.textContent = `${student.surname} ${student.name} ${student.middleName}`;
      row.appendChild(fullNameCell);

      const facultyCell = document.createElement('td');
      facultyCell.textContent = student.faculty;
      row.appendChild(facultyCell);

      const birthDateCell = document.createElement('td');
      const birthDate = student.birthDate.toLocaleDateString();
      const age = calculateAge(student.birthDate);
      birthDateCell.textContent = `${birthDate} (${age} лет)`;
      row.appendChild(birthDateCell);

      const studyYearsCell = document.createElement('td');
      const endYear = student.startYear + 4;
      const currentYear = new Date().getFullYear();
      const studyYears = `${student.startYear}-${endYear}`;
      const courseOrGraduated = endYear < currentYear ? 'закончил' : calculateCourse(student.startYear, currentYear)
      studyYearsCell.textContent = `${studyYears} (${courseOrGraduated})`;
      row.appendChild(studyYearsCell);

      tableBody.appendChild(row);
  })
}

// Дополнительная функция высчитывает возраст студента
function calculateAge(birthDate) {
  const today = new Date();
  const resultAge = today.getFullYear() - birthDate.getFullYear();
  return resultAge
}

// Дополнительная функция высчитывает на каком курсе
function calculateCourse(startYear, currentYear) {
  return currentYear - startYear + 1;
}

// Выводим форму из HTML для дальнейшей работы с ней
const addStudentForm = document.getElementById('add-form');

// Добавляем обработчик событий форме для добавление студента
addStudentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const surname = document.getElementById('surname').value.trim();
  const name = document.getElementById('name').value.trim();
  const middleName = document.getElementById('middleName').value.trim();
  const birthDate = new Date(document.getElementById('birthDate').value);
  const startYear = parseInt(document.getElementById('startYear').value);
  const faculty = document.getElementById('faculty').value.trim();

  const errors = validateStudentData(surname, name, middleName, birthDate, startYear, faculty)

  if (errors) {
      const newStudent = {
          surname,
          name,
          middleName,
          birthDate,
          startYear,
          faculty
      };

      students.push(newStudent);
      renderStudentTable(students);
      addStudentForm.reset();
  }


});

// Функция для удаления стиля ошибки и текста сообщения об ошибке
function removeError(inputElement) {
  const parent = inputElement.parentNode;
  parent.classList.remove('error');
  parent.querySelector('.span-error')?.remove(); // Удаляем элемент span с сообщением об ошибке, если он существует
}

// Функция валидации полей ввода
function validateStudentData(surname, name, middleName, birthDate, startYear, faculty) {

  let result = true;

  const surnameValid = document.getElementById('surname');
  const nameValid = document.getElementById('name');
  const middleNameValid = document.getElementById('middleName');
  const birthDateValid = document.getElementById('birthDate');
  const startYearValid = document.getElementById('startYear');
  const facultyValid = document.getElementById('faculty');

  function createError(input, text) {
      const parent = input.parentNode;
      parent.classList.add('error');
      const descError = document.createElement('span');
      descError.classList.add('span-error');
      descError.textContent = text;

      parent.appendChild(descError);

  }

  if (surname) {
      removeError(surnameValid);
  } else {
      createError(surnameValid, 'Введите фамилию')
      result = false;
  }

  if (name) {
      removeError(nameValid);
  } else {
      createError(nameValid, 'Введите имя');
      result = false;
  }

  if (middleName) {
      removeError(middleNameValid);
  } else {
      createError(middleNameValid, 'Введите отчество');
      result = false;
  }

  const today = new Date();
  const minDate = new Date('1900-01-01');
  if (birthDate < today || birthDate > minDate) {
      removeError(birthDateValid);
  } else {
      createError(birthDateValid, 'Некорректная дата рождения');
      result = false;
  }

  const currentYear = today.getFullYear();
  if (startYear || startYear < 2000 || startYear > currentYear) {
      removeError(startYearValid);
  } else {
      createError(startYearValid, 'Некорректная дата поступления');
      result = false;
  }

  if (faculty) {
      removeError(facultyValid);
  } else {
      createError(facultyValid, 'Введите название факультета');
      result = false;
  }

  return result;

}

// Функция для фильтрации
function filteredStudentsForm() {

  const nameFilter = document.getElementById('filterName').value.trim().toLowerCase();
  const facultyFilter = document.getElementById('filterFaculty').value.trim().toLowerCase();
  const startYearFilter = document.getElementById('filterStartYear').value;
  const endYearFilter = document.getElementById('filterEndYear').value;

  const filteredStudentsArr = students.filter(student => {
      const fullName = `${student.surname.toLowerCase()} ${student.name.toLowerCase()} ${student.middleName.toLowerCase()}`;
      const facultyName = student.faculty.toLowerCase();

      const nameMatch = fullName.includes(nameFilter);
      const facultyMatch = facultyName.includes(facultyFilter);
      const startYearMatch = !startYearFilter || student.startYear === parseInt(startYearFilter);
      const endYearMatch = !endYearFilter || (student.startYear + 4) === parseInt(endYearFilter);

      return nameMatch && facultyMatch && startYearMatch && endYearMatch;
  });

  renderStudentTable(filteredStudentsArr);
}

// Функция для сортировки
function sortStudent(arr, prop, dir = false) {
  return arr.sort((a, b) => {
      if(prop === 'fullName') {
          const fullNameA = `${a.surname} ${a.name} ${a.middleName}`.trim().toLowerCase();
          const fullNameB = `${b.surname} ${b.name} ${b.middleName}`.trim().toLowerCase();
          if(dir) {
            return fullNameA.localeCompare(fullNameB);
          } else {
              return fullNameB.localeCompare(fullNameA);
          }
      }
      if(dir) {
          if(a[prop] > b[prop]) return 1;
          if(a[prop] < b[prop]) return -1;
      } else {
          if(a[prop] > b[prop]) return -1;
          if(a[prop] < b[prop]) return 1;
      }

  })
}

// Отоброжаем таблицу со студентами
renderStudentTable(students);

let sortDirection = {}; // Добавляем глобальную переменную для хранения направления сортировки

function sortColumn(column) {
  sortStudent(students, column, sortDirection[column] || false); // Используем значение из объекта sortDirection или false по умолчанию
  renderStudentTable(students); // Рендерим таблицу после сортировки
  sortDirection[column] = !sortDirection[column]; // Переключаем направление сортировки
}

//Обработчик событий для фильтрации
const filterInputs = document.querySelectorAll('#filterName, #filterFaculty, #filterStartYear, #filterEndYear');
filterInputs.forEach(input => {
  input.addEventListener('input', filteredStudentsForm);
});

// Обработчик событий для сортировки
const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach((header, index) => {
  header.addEventListener('click', () => {
      const columns = ['fullName', 'faculty', 'birthDate', 'startYear'];
      sortColumn(columns[index]);
  });
});
