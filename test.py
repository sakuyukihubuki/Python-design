import psutil
import os
units = [
    {
        "input": [1, 2],
        "output": 1
    }
]
isMutiply = False
def solution(args):
    print(args)
    return False

def test(input, output):
    try:
        if not isMutiply:
            input = [ input ]
        user_output = solution(input)
        return user_output == output
    except:
        print(input)
        raise

def check(units):
    for unit in units:
        cur_input = unit.get("input")
        cur_output = unit.get("output")
        isPass = test(cur_input, cur_output)
        if isPass == False:
            return (cur_input, cur_output)
    return True

print(check(units), end="")
print(str(psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024)+'MB')
