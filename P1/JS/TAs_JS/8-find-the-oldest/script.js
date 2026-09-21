const people = [
    {
        name: "Carly",
        yearOfBirth: 1942,
        yearOfDeath: 1970
    },
    {
        name: "Ray",
        yearOfBirth: 1962,
        yearOfDeath: 2011
    },
    {
        name: "Jane",
        yearOfBirth: 1912,
        yearOfDeath: 1941
    },
    {
        name: "Marta",
        yearOfBirth: 1930,
        yearOfDeath: 2020
    },
    {
        name: "Luis",
        yearOfBirth: 1990
    }
];

/*
    Calcula la edad de una persona. Si no tiene yearOfDeath se asume que sigue viva,
    por lo que se usa el año actual obtenido con new Date().getFullYear().
*/
function getAge(person) {
    const anioFinal = person.yearOfDeath ?? new Date().getFullYear();
    return anioFinal - person.yearOfBirth;
}

/*
    reduce() recorre el arreglo acumulando un único resultado: en cada paso se
    compara la persona acumulada con la actual y se conserva la de mayor edad.
*/
function findTheOldest(people) {
    const mayor = people.reduce((personaMayor, persona) =>
        getAge(persona) > getAge(personaMayor) ? persona : personaMayor
    );

    console.log(mayor);
    return mayor;
}

findTheOldest(people);
