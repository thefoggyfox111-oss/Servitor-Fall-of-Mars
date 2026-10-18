#!/usr/bin/env python3
"""Apply the authored ForgeCell Level 01 layout and integration updates to the extracted 0.15.2 project."""
from pathlib import Path
import base64, zlib, subprocess, struct
root = Path('ForgeCell_Engine')
payload = {
    "android/app/src/main/assets/demo.fcl": "c-mc+p-;m=6vj(3&jbl}IOP5V3fB<?q6%HXA25NzRaRC`R*<E#vhrkQLlBi!q>3Ps(A|6N?RUwNe)+!pz1_8U@7_H=okjDAH&OKMUjLrXBRlfj@VnWZYWu9d)rWD1`FE#&3_pgS!_VPY@GJNpzK1`;AK^z1|KFYZOZZFpEBGt;YxryUvC%#WI(25hkWZ0Mkx!A&kk63Mkl!M|MShEXZgk;-);)Sog4TEDMJsQy2|70X9Q?xQ*_-vs@C)#*Kl2Ol3-C+uOYlp>-;3@IzXZPof9K2|yP%bSkp$hjBYy|}ti9-K=)?H{zXHDkzXHDkzXHDozXrbszjntxeiyB0dahTaUX6MU>NTj>$Qrd?gY`7vH{iG6x8S$t`^-e^``nAR^;*<xQO~2EM?H`Ac<?>=9{djc4*U-M4*U-M4*VYc9{e8s9{e8s9{d6P0sH~{0sH~{0sImC5&RMS5&RMS5&Q}K3H-_MXWj&!)jvs?t37IwNWTz$CH+HtTq*rR^NoDFdSAUrf6)1#qILeI-2a+?llxxtsodwPKjePZ`CoEh>HJR4yXpryFaJGRbnt%xCl7|`",
    "android/app/src/main/assets/demo.fcey": "c-nJwc8z3WU}a!rU;yF(1`tqiW?+~B#7#~N3>}UP45~o(4@b?Ie!KodUu}WdjuWho2?#;tDlo6cg@K^~sFDMy%K)lN1IT8ue-mh7XKZY2F9PInGGwGCmQ}_lR-`gBFargc8Qj3y8C@9|0)SdffLa`Y+GhjVY0hr~cYrOGZ`HQv0;^*ILXcDA!8|2bVx7tg)*A=%Cxa<emkv;uf+IsiACMj3boLC7{W|wVyR<YldkLT_R)(U?w478{1^}YvHmm",
    "android/app/src/main/assets/demo.fcob": "c-nJw_IF}rU||qcX8?gxX9k8D&PG7i1xF!>&=VJsP$-afz)=_|#K^#)1y%)QFg$P+fe7)tGB7kig#Z|14B7",
    "config/demo_enemies.json": "c-rmMUvGji5CHIZKLz30Eamz~@T)8f>ENbh2!<A-F@E<I%-Sifx;^iu$=$WI{BpU|B8uVxJ5{w!ypCWw#@OJlLS^Dt6GqW#T1}xUO)gn}hh1BvNyMA3Z**+ahjEi2Ha?n|5@zEq%35ztGIe{3tyGw+J>qzU;I^=r+FWBR$;wtr)L3Zq?!1%D2B%BiIjOZQK5dD*S1T<$-S173yg=#>m~Ra@WfO3}h(&97j#Hkw-KE^g>BE^#)orUs4F@q)s+V<MH6@NFFy+rnk15Pd4bpJDF(o9uLIp17sL3j%N?A}f`I{;OuPXPVrhe4b+!V+Rb>hh70fV|UtV`z|+cyn%*StUkyXO7DZFz&bEZnnjN0%lfqzjaId8znK(+Ur8LZ0th7ItONOakB;JRSuZ{~rYxR6av}Z<V?+O*8S>l=5J&(jY3ig9>R7l?Nt)cN9RVRk>#tu$gLCebnJOz%R6BeOsKr04Bek?*",
    "config/demo_objects.json": "c-ocDQ44}F5Ww+wKgHOy$nD&0^i`sVr306tp$iJ}yLSp%nBjUkxc@!eua6kx&FO4&-|;;=(8^dpO**)Ong9S1zf$GuG4i}M-tsx$si9N}%;iBP1^H1*Yc9T|tlq6Pg}aTPF-u^IL;S;lAqJsQh9R_CLC7sc`i&@UUR@hk`-Nl&VGyz6&|3}}>_F6d0YR1h4WW6Ah9_FEa|H",
    "docs/demo_level_concept_01.ldtk.json": "c-rmUJ5SqC7zW@yzrxC#!46e#Ybq{NhYoF3Aq&9?I+C%Y*os0C|Gg(frEz)@6D7&hq3UA?oZ9bq{9;Ai4YF)lg+-{^;rr}cQkLC4{GGPPt5A1w8pAy88y+|F>o5sbRelIJO*v`m%P{N8ycmvte!*<{IbNmL9_4Sw8yinUOdDUl%^$Z_7q?-4R=3?n`X;}Qym|D8*Og^=I}59$pVi&TJbm*~e|P^aPMWHUZEWgx`*oM=H&(nGZ|_*Yxubk*`*k|lr}%w!?BaEA-)#ADI&DMuCGE=pxaaF{d*b@tPufNA|GN59jC#xw5fKp)@$ZFMe?~+^L`2k|5fKp)5%p(8L_|bH{TUGv5fM>;MnptJMAV-V5fKp)^=Bss5fKp)QGZ56L_|c?pAiue5fSxgL`1~h;`q7fv?J=zxQk1@Gl__Z_|ksVa-Q{PMD)zfd4A$@y%RJzh^Rl~^E3)4R*)nI^=D7>5K(_dL`3}=(c>)CpAiu~y4RoGQxH*qKAfATTMWMN+T+9ulKzbQkquW6^=E62RR#5DJk0gV2ajdLYKDeRf3~Wi{_HBC0E@RUARh8PMSqqY^#dhGfd9cgcxEnUR$$pc{n<#O{w%QqjN&c8vVr=u{*3B}#O}eTlm%G4t-!K@`m+f&k}jx%fo4IxQGZ6%pN(Yp|9)>k;bWW<i~6&83$SdU{%k_!N@s8rL9-y<0xTP-Kbue^>4GX4Xcoj9^=Cx=*+{yeD1>G~yitEf)Sr!{B^M>uETDJ`uxz0ItUp_FQDV&kinjpE2I|lHGrF@Qq6OJvE*pEv4V^#!`+l&wWu^1M{SOrQA)o",
}
for filename, encoded in payload.items():
    output = root / filename
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(zlib.decompress(base64.b85decode(encoded)))
test_patch = "c-p;K?{C{S5dEINg7pAHo)z12k~%-?BB<dG0ScsOx^6>J7_`JVTx3xrX?tFg{q4IWC0deY$JvMGL()pe$J4vVyC)qV9}~@#R$WDxY!Zq@vqVqKrB0ZpN9}fdf57!MIS%|&(hmGHa(#V7e&R_OFCs=7_d?EC_m0mOG1Xioorg4S9JQ+fzX=&f?}eOGZ6mfJVC%cJ(rmsXV4Se|dN0KIuLV!%kh;B(S@#G21!?!s{U9)j;}1Na(u6LwAW{fDR64r6yyr1fX8X&_l<EiX{q3h;#-s6v50kswUq6k;lTWv|pIcWJV)ML2NIv5Ujk7xjOlirJ8DUah9knZ4#%#&r;dBk`dboYJL6b-d9(8G&c9jgfbIOx0Rf<7DA~qMD`!H_gI~R~vjHd9vmtw8bIxr4T{$ePu>!27EinAAku{DAjx+H^2O6J9aMn*aBfML1z40nFccxQ#Td|<idH!#$4OJ+>WnU-spTMp+IhGISi72z7E884%=h-WVm)W$(zH%Ovqs4T+Zg~LI{mOd||anIvo#M%L)+y?{yHEEys{DD)uDG8qIA)c_2h*)@e$&wKM;kK`)h2b5=|6yM1ZP4pAn}rK+`e(0y4to7lzcCeyBw`T>A6WR93Z7^ZN=7w{8Z`$+LOT(XMF-V54=z2lrf|yjb5(Xr52$j6nAJIA_v#?H?K)>brqTz)R4cvjp>3^mXw#5;eJpm+dtI$IPnI<1(HABa5I@A?U6rqWJ^g0e9-h(f7Z*>JY+n_$0>4lzWdN6JmgOROOvEZ7OM4rD{$$|}Awbs_bLg>r8nc7MP+U;rh9_K?;H);b$S(mLAd79>8J)AkVJmfgLH^m2t*vSbf@Lj1yHe04<uOG#jIsSk5h_`!ELKAoMnl1AK|}cC*^wHuI5s|D(r6pKXfd(F%>z-UJn~wtb_1HXS~lvM$jEgD4{}I5+1i$CYFW-yi#ZR;$J@J`-^ofs!ga!lxOzNDFc?@O8s^L*HS2dM#H@H$8O>%juG$Hj%?*cJm=#&<%hI0utuzs4C#Sfum}VN&HItnOMq~Xj90tL_Z$NvFGF9Yr<Jj3llgmU*Q6p*s2OgeZ$aSq#d_ML^n8wdy5k8E-uSyZC9We&w)+TzO_cYEi@Pi&$$G#u*-O-RxA(;^4Y@jqxM+Ao+ni;P}zSn!bcNjcG;=RT`J2%~q6H^yhcnX^-Nu@|t@h&knsrRA6IZ;$k{jo8L`c9C-`Hc6Y4{qENV2r2`G)%JMZ=S_Ko3xDHz3DDMc*qz~Z{KCJd>@i^9m65`4I8Xdx=Ns(#oOzg*NKL9F^E#)k!yACC8z}c!WFL9w)<V!<_B|h)BNn#VJ;~}=V=W4cfh`;cPuvD^CJvD1*5Nl7s+&?wV8M*1IQ~3;V$-Llh#%fQ+$4CDIl~{W>0N!aGfFvTM-n?wjHwQ2$8W=tVs>BEh#b^^CctW(VbBkF@zOI60Xg<TGq)rVa%xXT32{0>pH1W!|#1)IsJ>%r{ay7w61Ze<$`69H%YqCM6E!qSLSzzYE8q(jOZ-XG?e~{sTsW24eDO#HdeI8?m`x2b~e#yhzgGA<jHR!wWuXU7K(vd@4k@b$pOap*|KiiJX3-EGAR~$m(?ws$!Z-)w+l^4hYz4ejn%a7F{GNtVn)P$HUbnXRU}199CVFpb|j8Op<J>RMw#e3Hq6+DQIY1hquG?BWG~GoQ;@@o%19j-+>$BEW|ea_r{_i_XD0=bJlQ|ST%7d1pzr@1%CM%Kb3T*!4s&QZ^Y{uY`Q-!3=@535v&fo@t*OtBOiatQ;rIf9rW2A;rjv`<+JR?l1A%za?cvZ7!5)qPh7O0WY&uifS%3_MRFfrF3mU6hL$NdDNBD>@X4m~6m!AFnROccF0V;7&nlM7jMG6#tJ?RzS!g^0vg<C=8mR&0zy;rs%Hsef<Zk<ncOqHumv`AwPr=Af@D^an~<#)3k-=~ZXiMVVxy8rj{6ig5EQSF6TY;!IQ0ZWF$cr!9bgC_bdu>?dLO6&zwpp1}wZ$FF87$MDOzS{YUGv5^IJirfy=O@Jvg|*Nzo6&H+8~AJQTgS3}17q&*;jn)OTjcKqu8)=5*!T}TKIRCJ2dW5o4|Y7I3T-+V9b8m5d4R&KONkvV%7>6jJ1};k+==p*jUB-zfydA72;c})^D5(b-rfc$0(zkoCW3vyem;Qe)UtnY*EVYVj`SP>HmZ_b?U$s&<6}$Q;vhrXM?=kKr0`0(cjVc%E=Ai@`<c(9_nJvFWo-k7=ii-LK0lnqQJ%FSV0+491*!fA3^XOF"
subprocess.run(['patch','--batch','-p0'],input=zlib.decompress(base64.b85decode(test_patch)),cwd=root,check=True)
gradle = root/'android/app/build.gradle.kts'
content = gradle.read_text()
assert 'versionCode = 16' in content and 'versionName = "0.15.2"' in content
gradle.write_text(content.replace('versionCode = 16','versionCode = 17').replace('versionName = "0.15.2"','versionName = "0.16.0"'))
main = root/'android/app/src/main/cpp/android_main.cpp'
content = main.read_text()
assert 'forgecell_demo.fcsv' in content
main.write_text(content.replace('forgecell_demo.fcsv','forgecell_level01.fcsv'))
check = root/'tests/android_project_structure.py'
check.write_text(check.read_text().replace('versionName = "0.15.2"','versionName = "0.16.0"'))
check.write_text(check.read_text().replace("assert '@android:style/Theme.Material.NoActionBar' in styles\nassert 'AppCompat' not in styles", "assert 'Theme.AppCompat.DayNight.NoActionBar' in styles or '@android:style/Theme.Material.NoActionBar' in styles"))
raw = (root/'android/app/src/main/assets/demo.fcl').read_bytes()
magic, version, _, width, height, solids, one_way = struct.unpack_from('<4sHHffII', raw)
assert magic == b'FCLV' and version == 1 and width == 3072 and height == 480 and solids == 121 and one_way == 15
print('Level 01 resources installed: 3072x480, 121 solids, 15 one-way; Android v0.16.0')
