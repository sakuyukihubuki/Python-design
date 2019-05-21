def test(input, output):
    try:
        if not isMutiply:
            input = [ input ]
        user_output = solution(input)
        return [input, output, user_output == output]
    except:
        print(input)
        raise

print(test(input, output), end="")