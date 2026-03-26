import define
import numpy as np

class solver:
    def __init__(self,mechanics_objects,n=1):
        self.mechanics_objects = mechanics_objects
        self.n = n
        self.restrictioncnt = 3*n
        self.matrixcnt = 0
        self.restrictiondic = {"gdjzz":[],"hdjzz":[],"gz":[]}
        self.beta = np.zeros((3,1))
        self.A=np.zeros((3,3))

    def countequation(self):
        for obj in self.mechanics_objects:
            if type(obj) == define.gdjzz:
                self.restrictioncnt-=2
                self.restrictiondic["gdjzz"].append(obj)
            elif type(obj) == define.gz:
                self.restrictioncnt-=3
                self.restrictiondic["gz"].append(obj)
            elif type(obj) == define.hdjzz:
                self.restrictioncnt-=1
                self.restrictiondic["hdjzz"].append(obj)
            elif type(obj) == define.outerforce:
                self.beta[0]-=obj.fx
                self.beta[1]-=obj.fy
                self.beta[2]-=obj.fy*obj.place[0]-obj.fx*obj.place[1]
            elif type(obj) == define.outertorque:
                self.beta[2]-=obj.value
        
        if self.restrictioncnt < 0:
            raise ValueError("系统超静定")
        elif self.restrictioncnt > 0:
            raise ValueError("系统静不定")
        elif self.restrictioncnt == 0:
            print("✅可以求解...")
        else:
            raise ValueError("❌未知问题")
        
    def compileequation(self):

        for obj in self.restrictiondic["gdjzz"]:
                self.A[0,self.matrixcnt]=1
                self.A[1,self.matrixcnt]=0
                self.A[2,self.matrixcnt]=-obj.place[1]
                self.A[0,self.matrixcnt+1]=0
                self.A[1,self.matrixcnt+1]=1
                self.A[2,self.matrixcnt+1]=obj.place[0]
                self.matrixcnt+=2
        for obj in self.restrictiondic["hdjzz"]:
                self.A[0,self.matrixcnt]=obj.direction[0]
                self.A[1,self.matrixcnt]=obj.direction[1]
                self.A[2,self.matrixcnt]=obj.place[0]*obj.direction[1]-obj.place[1]*obj.direction[0]
                self.matrixcnt+=1
        for obj in self.restrictiondic["gz"]:
                self.A[0,self.matrixcnt]=1
                self.A[1,self.matrixcnt]=0
                self.A[2,self.matrixcnt]=-obj.place[1]
                self.A[0,self.matrixcnt+1]=0
                self.A[1,self.matrixcnt+1]=1
                self.A[2,self.matrixcnt+1]=obj.place[0]
                self.A[0,self.matrixcnt+2]=0
                self.A[1,self.matrixcnt+2]=0
                self.A[2,self.matrixcnt+2]=1
                self.matrixcnt+=3
        print("✅编译完成...")
    
    def solveequation(self):
        self.countequation()
        self.compileequation()
        X = np.linalg.solve(self.A,self.beta)
        print("✅求解完成...")
        print(X)
        
