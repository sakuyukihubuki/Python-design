class Solution:
    def findMedianSortedArrays(self, nums1, nums2) -> float:
        nums1.extend(nums2)
        n=sorted(nums1)
        print(n)
        if len(n)%2==1:
            return float(n[len(n)//2])
        else:
            i1=n[len(n) // 2 -1]
            i2=n[len(n)//2]
            return float((i1+i2)/2)