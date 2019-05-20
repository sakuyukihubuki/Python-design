'''
    You should prepend mutiply, units and solution(input)
'''
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