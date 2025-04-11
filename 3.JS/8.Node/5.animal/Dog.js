const Animal = require('./Animal.js');

class Dog extends Animal { // 이걸 상속(inheritance) 라고 부름
  makeSound() { // 함수의 오버라이딩
                // 부모 함수를 그대로 쓸 수도 있고, 내가 재정의할 수도 있음
    return `${this.name} 멍멍`;
  }
}

module.exports = Dog;