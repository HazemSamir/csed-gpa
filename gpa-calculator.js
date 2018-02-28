var app = angular.module('gpa-calculator', []);

app.directive('navSemester', function(){
  return {
    restrict: 'E',
    templateUrl: 'nav-semester.html'
  };
});

app.controller('calculator', function(){
  var that = this;

  this.years = years;
  this.grades = { };
  this.gpa = 0;

  this.initializeGrades = function (localGrades) {
    // Checks if grades exist in local storage.
    if(localGrades != null) {
      // Use value initialized in local storage.
      this.grades = JSON.parse(localGrades);
    } else {
      // copy GRADES object
      for (grade in GRADES) {
        this.grades[grade] = GRADES[grade];
      }
    }
  };

  this.initializeYears = function (localYears) {
    // Checks if year configuration exists in local storage.
    if(localYears != null) {
      // Use value initialized in local storage.
      that.years = JSON.parse(localYears);
    } else {
      // init subjects grades
      for(var i = 0; i < that.years.length; i++) {
        var year = that.years[i];
        for(var j = 0; j < year.length; j++) {
          var semester = year[j];
          semester.enabled = false;
          for(var k = 0; k < semester.subjects.length; k++) {
            var subject = semester.subjects[k];
            subject.grade = 'Distinction';
          }
        }
      }
    }
  };

  this.initializeGrades(localStorage.grades);
  this.initializeYears(localStorage.years);

  var yearsName = [['Preparatory', 'Prep'], ['First', '1st'], ['Second', '2nd'],
                   ['Third', '3rd'], ['Fourth', '4th']];
  this.getYearName = function (year) {
    if (year < yearsName.length)
      return yearsName[year][0];
  }

  this.calculateGPA = function () {
  	var num = 0, denom = 0;

  	//Calculations
  	for(var i = 0; i < that.years.length; i++) {
      var year = that.years[i];
  		for(var j = 0; j < year.length; j++) {
        var semester = year[j];
  			if( !!semester.enabled ) {
  				for(var k = 0; k < semester.subjects.length; k++) {
            var subject = semester.subjects[k];
            if (!!subject.continuous) continue;
            subject.grade = subject.grade || 'Distinction';
            var points = that.grades[subject.grade] || GRADES[subject.grade]
  					num += points * (subject.totHours || subject.hours);
  					denom += (subject.totHours || subject.hours);
  				}
  			}
  		}
  	}

  	if(denom != 0) {
  		that.gpa = num / denom;
  	} else {
      that.gpa = 0;
    }

    localStorage.years = JSON.stringify(that.years);
    localStorage.grades = JSON.stringify(that.grades);
  };

  // Use to calculate the GPA when the page loads initially with certain local storage data.
  this.calculateGPA();
});

var GRADES = {
  'Distinction': 4,
  'Very Good': 3.5,
  'Good': 2.75,
  'Pass': 2,
  'Weak': 1,
  'Very Weak': 0
};

var years = [
  // Preparatory
  [
    // 1st semester
    {
      enabled: false,
      subjects: [
        { code: 'MP011', subject: 'Mathematics-1', hours: 6 },
        { code: 'MP021', subject: 'Mechanics-1 (Continuous Subject)', hours: 4, continuous: true },
        { code: 'MP031', subject: 'Physics-1', hours: 6 },
        { code: 'MP041', subject: 'Engineering Drawing-1 (Continuous Subject)', hours: 6, continuous: true },
        { code: 'CS021', subject: 'Computers and Programming', hours: 4 },
        { code: 'PE011', subject: 'Production', hours: 4 }
      ]
    },
    // 2nd semester
    {
      enabled: false,
      subjects: [
        { code: 'MP012', subject: 'Mathematics-2', hours: 6 },
        { code: 'MP022', subject: 'Mechanics-2', hours: 4, totHours: 8 },
        { code: 'MP032', subject: 'Physics-2', hours: 6 },
        { code: 'MP042', subject: 'Engineering Drawing-2', hours: 6, totHours: 12 },
        { code: 'CH011', subject: 'Engineering Chemistry', hours: 4 },
        { code: 'HS011', subject: 'English', hours: 2 },
        { code: 'HS021', subject: 'Engineering Science History', hours: 2 }
      ]
    }
  ],
  // 1st Year
  [
    // 1st semester
    {
      enabled: false,
      subjects: [
        { code: 'MP113', subject: 'Mathematics-3', hours: 6 },
        { code: 'CS121', subject: 'Programming-1',  hours: 5 },
        { code: 'EE112', subject: 'Electric Engineering Fundamentals', hours: 6 },
        { code: 'MP127', subject: 'Mechanics-3', hours: 4 },
        { code: 'EE131', subject: 'Modern Physics', hours: 6 },
        { code: 'HS171', subject: 'Computer and Productivity Support', hours: 3 }
      ]
    },
    // 2nd semester
    {
      enabled: false,
      subjects: [
        { code: 'MPx14', subject: 'Mathematics-4', hours: 6 },
        { code: 'CS111', subject: 'Propability Theory and Computer Application', hours: 4 },
        { code: 'CS122', subject: 'Data Structures-1', hours: 5 },
        { code: 'CS131', subject: 'Computer Fundamentals', hours: 6 },
        { code: 'EEx11', subject: 'Electric Circuits', hours: 6 },
        { code: 'HS172', subject: 'Computer and Society', hours: 3 }
      ]
    }
  ],
  // 2nd Year
  [
    // 1st semester
    {
      enabled: false,
      subjects: [
        { code: 'CS211', subject: 'Mathematics for Computer', hours: 6 },
        { code: 'CS221', subject: 'Programming-2', hours: 5 },
        { code: 'EE236', subject: 'Electronics', hours: 6 },
        { code: 'CS212', subject: 'Statistical Methods for Computers', hours: 4 },
        { code: 'CS231', subject: 'Digital Systems-1', hours: 6 },
        { code: 'HSx12', subject: 'Technical Reports Writing', hours: 2 }
      ]
    },
    // 2nd semester
    {
      enabled: false,
      subjects: [
        { code: 'CS213', subject: 'Numerical Analysis and Computer Applications', hours: 5 },
        { code: 'CS222', subject: 'Systems and Components Programming', hours: 5 },
        { code: 'CS232', subject: 'Digital Systems-2', hours: 6 },
        { code: 'CS241', subject: 'Linear Control Systems', hours: 6 },
        { code: 'CS223', subject: 'Data Structures-2', hours: 6 },
        { code: 'HSx33', subject: 'Laws For Engineering Profession', hours: 2 }
      ]
    }
  ],
  // 3rd Year
  [
    // 1nd semester
    {
      enabled: false,
      subjects: [
        { code: 'CS331', subject: 'Micro Systems', hours: 6 },
        { code: 'CS341', subject: 'Non-Linear Control Systems', hours: 6 },
        { code: 'CS311', subject: 'Algorithms', hours: 5 },
        { code: 'CS332', subject: 'Digital Signal Processing', hours: 5 },
        { code: 'CS333', subject: 'Operating Systems', hours: 5 },
        { code: 'HS373', subject: 'Human to Computer Interaction-1', hours: 3 }
      ]
    },
    // 2nd semester
    {
      enabled: false,
      subjects: [
        { code: 'CS312', subject: 'Operations Research', hours: 5 },
        { code: 'CS334', subject: 'Embedded Systems', hours: 6 },
        { code: 'CSx35', subject: 'Computer Architecture', hours: 5 },
        { code: 'CS321', subject: 'Programming Languages and Compilers', hours: 5 },
        { code: 'CS322', subject: 'Database Systems', hours: 6 },
        { code: 'HS374', subject: 'Human to Computer Interaction', hours: 3 }
      ]
    }
  ],
  // 4th Year
  [
    // 1nd semester
    {
      enabled: false,
      subjects: [
        { code: 'CS431', subject: 'Computer Networks', hours: 6 },
        { code: 'CS4E1', subject: 'Elective Course-1', hours: 5 },
        { code: 'CS4E2', subject: 'Elective Course-2', hours: 5 },
        { code: 'CS441', subject: 'Modern Control Systems', hours: 5 },
        { code: 'CS401', subject: 'Project (Continuous Subject)', hours: 5, continuous: true},
        { code: 'HSx64', subject: 'Engineering Economy', hours: 4 }
      ]
    },
    // 2nd semester
    {
      enabled: false,
      subjects: [
        { code: 'CS432', subject: 'Distributed Systems and Internet Programing', hours: 6 },
        { code: 'CS4E3', subject: 'Elective Course-3', hours: 5 },
        { code: 'CS4E4', subject: 'Elective Course-4', hours: 5 },
        { code: 'CS433', subject: 'Performance Analysis', hours: 6 },
        { code: 'CS402', subject: 'Project', hours: 5, totHours: 10 },
        { code: 'HS444', subject: 'Social Dangerouse and Securing Computer Systems', hours: 3 }
      ]
    }
  ]
];
