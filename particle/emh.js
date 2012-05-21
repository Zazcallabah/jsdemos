var _MOVE_PART = function()
{
}
/*
%Projekt: 	A3. Det Geomagnetiska Fältets Påverkan på Månens Strålningsmiljö

%Författare: 	Emelie R. Holm

%Konstanter
eV = 1.60218e-019;           %En elektronvolt [J]
MJ = 3844e005;               %Avstånd mellan månen och jorden [m]
RE = 6.378e006;              %Jordradien [m]
MR = 1.7371e006;             %Månradien [m]
c = 3e008;                   %Ljusets hastighet [m/s]
q = 1.602e-19;               %Elementarladdning för proton [C]
m = 1.6726e-27;              %Protons massa [kg]

%Parametrar
dt = 1e-003;                 %Tidssteg [s]
E = 3e005*1e006*eV;          %Energi [J]

iopt = 3;                    %Värde beroende av aktivitet där ca 3 är medel
ps = 0;                      %Ingen lutning av dipol
parmod = zeros(10,1);        %Skapar 1x10 nollvektor

%Funktioner
absv = c*sqrt(1-1/(E/(m*c^2)+1)^2);     %Hastighetens belopp [m/s]
g = 1/sqrt(1-absv^2/c^2);               %Gamma

%Övrigt
M = zeros(1,3);     %Vektor för slutposition sätts från början till en nollvektor
hold on;

j=1;

while j<37              %Kommer loopa för 36 olika vinklar
theta = j*10*pi/180;    %Vinkeln [rad]

M(1, 1) = j*10;         %Plockar ut värdet av vinkeln till vektorn

r = [-MJ+(MJ+10*RE)*cos(theta) (MJ+10*RE)*sin(theta) 0]; %Postition [m]
v = [-absv*cos(theta) -absv*sin(theta) 0];           %Hastighet [m/s]
p = m.*v.*g;                                         %Rörelsemängd [kg*m/s]

i=1;

%Så länge partikeln är inom avstånd 2*(MJ+11*RE) från origo och inte har träffat månen
while sqrt(r(1)^2 + r(2)^2 + r(3)^2) < 2*(MJ+11*RE)  && sqrt((r(1)+MJ)^2 + r(2)^2 + r(3)^2) > MR
	%Magnetfältet definieras som 0 för x>=5 jordradier
if r(1)>=5*RE
	B_field = [0,0,0];
%och med Tsyganenkos modell för övrigt
else
[bx,by,bz] = T89C(iopt,parmod,ps,r(1)/RE,0,r(3)/RE);
B_field = [bx,by,bz]*1e-009;
end

%Kraften som påverkar partikeln är F=qvxB [N]
A = q*v;
F = cross(A,B_field);

%Numeriska differentialekvationer
p = p + dt*F;                      %Rörelsemängd [kg*m/s]
pabs = sqrt(p(1)^2+p(2)^2+p(3)^2); %Absolutbeloppet av rörelsemängd [kg*m/s]
v = p.*1./sqrt(m^2+pabs^2/c^2);    %Hastigheten [m/s]
r = r + dt*v;                      %Punkt: r=r+dr [m]

i=i+1;

end

M(1, 2) = r(1)/RE; %Plockar ut x-värdet av slutpostion för partikeln
M(1, 3) = r(2)/RE; %Plockar ut y-värdet av slutpostion för partikeln
disp(M)            %Skriver ut slutpostion för partikeln

j=j+1;

end





*/