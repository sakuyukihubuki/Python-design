class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        for i in range(m+n-1):
            if nums2:
                item = nums2.pop(0)
                if nums1[i]>item: # 注意num1长度为m+n
                    nums1[:]=nums1[:i]+[item]+nums1[i:]
                else:
                    nums2 = [item]+nums2  # nums2 有序
        nums1[:] = nums1[:m+(n-len(nums2))]+nums2 if nums2 else nums1[:m+n]