units = [{"input":[[2,7,11,15],9],"output":[0,1]},{"input":[[3,5,8,4,11],14],"output":[0,4]},{"input":[[3,4,8,1,5,8,9,10],9],"output":[2,3]}]
isMutiply = True
def solution(input):
	return [0, 1]
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
            return [cur_input, cur_output, False]
    return True

print(check(units), end="")