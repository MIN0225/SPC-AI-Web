class Human:
  def __init__(self, name, age, gender):
    self.name = name
    self.age = age
    self.gender = gender
  def who(self):
    print(f"이름: {self.name} 나이: {self.age} 성별: {self.gender}")
    
areum = Human("아름", 25, "여자")
areum.who()