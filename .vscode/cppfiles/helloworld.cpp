/*
#include <iostream>
#include <vector>

using namespace std;

void rotate_grid(int n, vector<vector<char>> grid, int angle) {
    vector<vector<char>> newgrid(n, vector<char>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int ni = 2 * i - (n+1);
            int nj = 2 * j - (n+1);
            // rotation is (ni, nj) -> (nj, -ni)
            // newgrid[i][j] = function thingy
            if (angle == 90) {
               newgrid[i][j] = rotate_90_clockwise(n, grid, ni, nj);
            } else if (angle == -90) {
               newgrid[i][j] = rotate_90_anticlockwise(n, grid, ni, nj);
            } else if (angle == 180) {
               newgrid[i][j] = rotate_180_clockwise(n, grid, ni, nj);
            }
        }
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            grid[i][j] = newgrid[i][j];
        }
    }
}

// must provide square grid of even length
// 0, 2, 4, 8 -> length 4, middle is n + 1
char rotate_90_clockwise(int n, vector<vector<char>> &grid, int ni, int nj) {
    return grid[(nj + (n+1)) / 2][(-ni + (n+1)) / 2];
}
char rotate_90_anticlockwise(int n, vector<vector<char>> &grid, int ni, int nj) {
    return grid[(-nj + (n+1)) / 2][(ni + (n+1)) / 2];
}
char rotate_180_clockwise(int n, vector<vector<char>> &grid, int ni, int nj) {
    return grid[(-ni + (n+1)) / 2][(-nj + (n+1)) / 2];
}

int main() {
    
}
*/

#include <iostream>

using namespace std;

#define ROWS 1000
#define COLS 1000

int grid[ROWS][COLS];

// coordinate counter

int main(void) {
    int n;
    int m;

    cin >> n;
    for (int i = 0; i < n; i++) {
        int r, c;
        cin >> r >> c;
        grid[r][c]++;
    }

    cin >> m;
    for (int i = 0; i < n; i++) {
        int result = 0;
        int r, c;
        for (int i = -1; i <= 1; i++) {
            for (int j = -1; j <= 1; j++) {
                if (r + i >= 0 && c + j >= 0 && r + i <= ROWS - 1 && c + j <= COLS - 1) {
                    result += grid[r + i][c + j];
                }
            }
        }
        cout << result;
    }
}