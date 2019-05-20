'''
    You should prepend isMutiply(if many params), input, output and solution(input)
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

print(test(input, output), end="")