class Solution:
    def addBinary(self, a: str, b: str) -> str:
        flag = 0
        result = ''
        max_len = max(len(a), len(b))
        a = a.zfill(max_len)[::-1]
        b = b.zfill(max_len)[::-1]
        
        for i in range(max_len):
            result += str(int(a[i])^int(b[i])^flag)
            if a[i] == '0' and b[i] == '0':
                flag = 0
            elif a[i] == '1' and b[i] =='1':
                flag =1
        if flag == 1:
            result += '1'
        return result[::-1]
    def addBinary(self, a: str, b: str) -> str:
        a=eval('0b'+a)
        b=eval('0b'+b)
        return bin(a+b)[2:]

    def addBinary(self, a: 'str', b: 'str') -> 'str':
        a = int("0b"+a,2);b = int("0b"+b,2)
        return bin(a+b)[2:]
    def addBinary(self, a: str, b: str) -> str:
        len1 = len(a)
        len2 = len(b)
        maxl =  max(len1,len2)
        a = list(reversed(a))
        b = list(reversed(b))
        temp = 0
        ans = []
        for i in range(maxl):
            if i >= len1 :
                sums = int(b[i]) + temp
            elif i >= len2 :
                sums = int(a[i]) + temp
            else:
                sums = int(a[i])+int(b[i])+temp
            ans += str(sums%2)
            temp = sums//2
                    
        if temp == 1:
            ans += "1"
        return "".join(list(reversed(ans)))