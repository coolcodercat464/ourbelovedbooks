#include <stdio.h>
#include <stdlib.h>

struct node {
    struct node *next;
    int value;
};

struct node* new_node(int value) {
    struct node* mynode = malloc(sizeof(*mynode));
    mynode->value = value;
    mynode->next = NULL;
    return mynode;
}

int main() {
    int initial = 4;
    struct node *startnode = new_node(initial);
    struct node *previousnode = startnode;
    struct node *previousnode2 = startnode;
    struct node *previousnode3 = startnode;
    
    for (int i = initial+1; i < 8; i++) {
        previousnode->next = new_node(i);
        previousnode = previousnode->next;
    }

    while (previousnode3 != NULL) {
        if (previousnode3->next != NULL && previousnode3->next->value == 8) {
            free(previousnode->next);
            previousnode3->next = previousnode3->next->next;
            break;
        }
        previousnode3 = previousnode3->next;
    }

    while (previousnode2 != NULL) {
        printf("%d \n", previousnode2->value);
        previousnode2 = previousnode2->next;
    }
}
