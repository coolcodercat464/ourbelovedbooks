#include <iostream>
#include <set>
#include <math.h>
#include <string>

using namespace std;

class Child {
    public:
    int age;
    string name;
    Child(int age, string name) {
        this->age = age;
        this->name = name;
    }
    
};
bool operator<(const Child &a, const Child &b) {
    if (a.age != b.age) {
        return a.age < b.age;
    }
    return a.name < b.name;
}

// daycare facility with three types of centers:
//  - butterfly (ages 1 - 2) -> 4 children max
//  - dragon (ages 2 - 4) -> 3 children max
//  - tiger (ages 4 - 6) -> max specified by user

class Daycare {
    private:
    int min_age;
    int max_age;
    int max_children;
    set<Child> all_children;
    protected:
    Daycare(int min_age, int max_age, int max_children) : min_age(), max_age(), max_children() {}
    public:
    bool add_child(Child child) {
        if (all_children.size() >= max_children || child.age < min_age || child.age > max_age) {
            return false;
        } else {
            all_children.insert(child);
            return true;
        }
    }
    bool remove_child(Child child) {
        if (all_children.size() <= 0 || all_children.find(child) == all_children.end()) {
            return false;
        } else {
            all_children.erase(child);
            return true;
        }
    }
    void see_children() {
        for (Child child : all_children) {
            cout << child.name << ", age " << child.age << "\n";
        }
    }
    int get_size() { return all_children.size(); }
};

class Butterfly : public Daycare {
    public:
    Butterfly() : Daycare(1, 2, 4) {}
    bool is_square() {
        if (sqrt(get_size()) - (int) sqrt(get_size()) == 0) {
            return true;
        } else {
            return false;
        }
    }
};

class Dragon : public Daycare {
    public:
    Dragon() : Daycare(2, 4, 3) {}
};


class Tiger : public Daycare {
    public:
    Tiger(int max_size) : Daycare(4, 6, max_size) {}
};

// time is fixed
// bounds are inclusive
// children are added to center wherever space is available (arbitrary order for overlapping age ranges)
// butterfly would also like to check if the space available is a square number
// think about the access modifiers of the class attributes

int main() {
    Butterfly butterfly = Butterfly();
    Dragon dragon = Dragon();
    Tiger tiger = Tiger(2);

    for (int i = 0; i < 5; i ++) {
        Child child = Child(4, "Child #" + to_string(i));
        cout << tiger.add_child(child) << "\n";
    }
    cout << tiger.remove_child(Child(4, "Child #3")) << "\n";
    tiger.see_children();
}