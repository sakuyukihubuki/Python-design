class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        i=0
        flag=0
        intervals.append(newInterval)
        l=sorted(intervals,key=lambda x:x[0])
        while i < len(l)-1:
            if l[i][1]>=l[i+1][0]:
                l[i]=[l[i][0],max(l[i][1],l[i+1][1])]
                l.remove(l[i+1])
                flag=1
            else:
                if flag:break
                i+=1
        return l