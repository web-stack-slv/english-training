const words = [
    { 
        word: 'Кошка', 
        variants: [            
            {word: 'Dog', isRight: false},
            {word: 'Monkey', isRight: false},
            {word: 'Cat', isRight: true},
            {word: 'Goat', isRight: false},
        ]
    },{ 
        word: 'Собака', 
        variants: [
            {word: 'Cat', isRight: false},            
            {word: 'Goat', isRight: false},
            {word: 'Dog', isRight: true},
            {word: 'Monkey', isRight: false},
        ]
    },{ 
        word: 'Обезьяна', 
        variants: [
            {word: 'Cat', isRight: false},            
            {word: 'Goat', isRight: false},
            {word: 'Dog', isRight: false},
            {word: 'Monkey', isRight: true},
        ]
    },{ 
        word: 'Козел', 
        variants: [
            {word: 'Cat', isRight: false},            
            {word: 'Goat', isRight: true},
            {word: 'Dog', isRight: false},
            {word: 'Monkey', isRight: false},
        ]
    },{ 
        word: 'Машина', 
        variants: [
            {word: 'Dog', isRight: false},
            {word: 'Car', isRight: true},
            {word: 'Goat', isRight: false},
            {word: 'Cat', isRight: false}            
        ]
    }
]