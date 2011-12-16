var SSI=SSI||{};SSI.EarthExtensions=function(f){var b=this;var c=6371;var g=new THREE.Vector3(0,0,0);var e=undefined;f.setObjectInLibrary("default_ground_object_geometry",new THREE.SphereGeometry(150,20,10));f.setObjectInLibrary("default_ground_object_material",new THREE.MeshLambertMaterial({color:52224}));f.setObjectInLibrary("default_ground_track_material",new THREE.MeshBasicMaterial({color:13369344,transparent:true,opacity:0.4,blending:THREE.AdditiveBlending}));f.setObjectInLibrary("default_sensor_projection_material",new THREE.MeshBasicMaterial({color:16755200,transparent:true,blending:THREE.AdditiveBlending,overdraw:true,opacity:0.15}));f.setObjectInLibrary("default_orbit_line_material",new THREE.LineBasicMaterial({color:10027008,opacity:1}));f.setObjectInLibrary("default_ground_object_tracing_line_material",new THREE.LineBasicMaterial({color:39168,opacity:1}));this.addEarth=function(p){var o=40,m=30;var n=new THREE.SphereGeometry(c,o,m);var k={uniforms:{texture:{type:"t",value:0,texture:null}},vertexShader:["varying vec3 vNormal;","varying vec2 vUv;","void main() {","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","vNormal = normalize( normalMatrix * normal );","vUv = uv;","}"].join("\n"),fragmentShader:["uniform sampler2D texture;","varying vec3 vNormal;","varying vec2 vUv;","void main() {","vec3 diffuse = texture2D( texture, vUv ).xyz;","float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );","vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );","gl_FragColor = vec4( diffuse + atmosphere, 1.0 );","}"].join("\n")};var h=THREE.UniformsUtils.clone(k.uniforms);h.texture.texture=THREE.ImageUtils.loadTexture(p.image);var j=new THREE.ShaderMaterial({uniforms:h,vertexShader:k.vertexShader,fragmentShader:k.fragmentShader});var l=new THREE.Mesh(n,j);f.addObject({id:"earth",objectName:"earth",update:function(r){var s=CoordinateConversionTools.convertTimeToGMST(f.getCurrentUniverseTime());l.rotation.y=s*(2*Math.PI/360)},draw:function(){f.draw(this.id,l,false)}})};this.addMoon=function(s){var o=40,h=30;var j=1737.1;var r={x:-360680.9359251,y:-42332.8629642,z:-30945.6526294,x_dot:0.1634206,y_dot:-1.0634127,z_dot:0.0412856,epoch:new Date(f.getCurrentUniverseTime())};var n=new THREE.SphereGeometry(j,o,h);var l={uniforms:{texture:{type:"t",value:0,texture:null}},vertexShader:["varying vec3 vNormal;","varying vec2 vUv;","void main() {","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","vNormal = normalize( normalMatrix * normal );","vUv = uv;","}"].join("\n"),fragmentShader:["uniform sampler2D texture;","varying vec3 vNormal;","varying vec2 vUv;","void main() {","vec3 diffuse = texture2D( texture, vUv ).xyz;","float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );","vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );","gl_FragColor = vec4( diffuse + atmosphere, 1.0 );","}"].join("\n")};var p=THREE.UniformsUtils.clone(l.uniforms);p.texture.texture=THREE.ImageUtils.loadTexture(s.image);var m=new THREE.ShaderMaterial({uniforms:p,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader});var k=new THREE.Mesh(n,m);f.addObject({id:"moon",objectName:"moon",stateVector:r,update:function(t){var w=new ECICoordinates(this.stateVector.x,this.stateVector.y,this.stateVector.z,this.stateVector.x_dot,this.stateVector.y_dot,this.stateVector.z_dot);var x=new Date(f.getCurrentUniverseTime());var t=(x.getTime()-this.stateVector.epoch.getTime())/1000;var v=OrbitPropagator.propagateOrbit(w,t,100,this.stateVector.epoch);var u=d({x:v.x,y:v.y,z:v.z});k.position={x:u.x,y:u.y,z:u.z}},draw:function(){f.draw(this.id,k,false)}})};this.addSpaceObject=function(k){var j,h;f.getObjectFromLibraryById(k.modelId,function(l){j=l;f.getObjectFromLibraryById("default_material",function(m){h=m;var n=new THREE.Mesh(j,h);f.addObject({id:k.id,objectName:k.objectName,update:function(o){var p=d(k.propagator());if(p!=undefined){n.position.set(p.x,p.y,p.z);n.lookAt(g)}},draw:function(){f.draw(this.id,n,false);b.showModelForId(k.showVehicle,this.id)}});b.addPropogationLineForObject(k);b.showOrbitLineForObject(k.showPropogationLine,k.id);b.addGroundTrackPointForObject(k);b.showGroundTrackForId(k.showGroundTrackPoint,k.id);b.addSensorProjection(k);b.showSensorProjectionForId(k.showSensorProjections,k.id);b.addClosestGroundObjectTracingLine(k)})})};this.addGroundObject=function(j){var l,h,k;if(!j.modelId){j.modelId="default_ground_object_geometry";k="default_ground_object_material"}else{k="default_material"}f.getObjectFromLibraryById(j.modelId,function(m){l=m;f.getObjectFromLibraryById(k,function(o){h=o;l.applyMatrix(new THREE.Matrix4().setRotationFromEuler(new THREE.Vector3(Math.PI/2,Math.PI,0)));var n=new THREE.Mesh(l,h);f.addObject({id:j.id,objectName:j.objectName,currentLocation:undefined,update:function(s){var r=d(j.propagator());n.position.set(r.x,r.y,r.z);this.currentLocation={x:r.x,y:r.y,z:r.z};var p=new THREE.Vector3(r.x,r.y,r.z);p.multiplyScalar(1.4);n.lookAt(p)},draw:function(){f.draw(this.id,n,true)}})})})};this.addGroundTrackPointForObject=function(j){var k,h;f.getObjectFromLibraryById("default_ground_object_geometry",function(l){k=l;f.getObjectFromLibraryById("default_ground_track_material",function(n){h=n;var m=new THREE.Mesh(k,h);f.addObject({id:j.id+"_groundPoint",objectName:j.objectName,update:function(p){var r=d(j.propagator(undefined,false));if(r!=undefined){var o=new THREE.Vector3(r.x,r.y,r.z);o.multiplyScalar(c/o.length());m.position.copy(o)}},draw:function(){f.draw(this.id,m,true)}})})})};this.addPropogationLineForObject=function(j){var k,h;k=new THREE.Geometry();f.getObjectFromLibraryById("default_orbit_line_material",function(p){h=p;var s=new Date(f.getCurrentUniverseTime());var n=1440;for(var o=0;o<n;o+=5){var r=d(j.propagator(s,false));if(r!=undefined){var m=new THREE.Vector3(r.x,r.y,r.z);k.vertices.push(new THREE.Vertex(m))}s.setMinutes(s.getMinutes()+5)}var l=new THREE.Line(k,h);f.addObject({id:j.id+"_propogation",objectName:j.objectName,update:function(t){},draw:function(){f.draw(this.id,l,false)}})})};this.addSensorProjection=function(l){var m,j;var p=d(l.propagator(undefined,false));if(p!=undefined){var h=1;m=new SensorPatternGeometry(h);var n=new THREE.Vector3(p.x,p.y,p.z);var k=n.length()-c;var o=0.15;f.getObjectFromLibraryById("default_sensor_projection_material",function(r){j=r;var s=new THREE.Mesh(m,j);s.doubleSided=true;f.addObject({id:l.id+"_sensorProjection",objectName:l.objectName,update:function(u){var v=d(l.propagator(undefined,false));if(v!=undefined){var t=new THREE.Vector3(v.x,v.y,v.z);s.position.copy(t);s.scale.z=t.length()-c+200;s.scale.x=s.scale.y=s.scale.z*o;var w=new THREE.Vector3(0,0,0);s.lookAt(w)}},draw:function(){f.draw(this.id,s,false)}})})}};this.addClosestGroundObjectTracingLine=function(j){var k,h;f.getObjectFromLibraryById("default_ground_object_tracing_line_material",function(m){h=m;var l=undefined;f.addObject({id:j.id+"_controlLine",objectName:j.objectName,update:function(o){var s=d(j.propagator(undefined,false));var r=b.findClosestGroundObject(s);if(r!=undefined){k=new THREE.Geometry();var n=new THREE.Vector3(s.x,s.y,s.z);k.vertices.push(new THREE.Vertex(n));var p=new THREE.Vector3(r.currentLocation.x,r.currentLocation.y,r.currentLocation.z);k.vertices.push(new THREE.Vertex(p));l=new THREE.Line(k,h)}},draw:function(){f.unDraw(this.id);if(l!=undefined){f.draw(this.id,l,false);if(e!=undefined){b.showControlLineForId(e,j.id)}else{b.showControlLineForId(j.showControlLine,j.id)}}}})})};this.findClosestGroundObject=function(h){if(h!=undefined){var j=new THREE.Vector3(h.x,h.y,h.z);j.multiplyScalar(c/j.length());return b.findClosestObject({x:j.x,y:j.y,z:j.z})}return undefined};this.findClosestObject=function(j){var k=f.getGraphicsObjects();var p=undefined;var n=undefined;var m=new THREE.Vector3(j.x,j.y,j.z);for(var l in k){if(k[l].currentLocation!=undefined){var h=new THREE.Vector3(k[l].currentLocation.x,k[l].currentLocation.y,k[l].currentLocation.z);var o=h.distanceTo(m);if(p==undefined||o<p){n=k[l];p=o}}}return n};this.showAllOrbitLines=function(k){var h=f.getGraphicsObjects();for(var j in h){if(h[j].id.indexOf("_propogation")!=-1){f.showObject(h[j].id,k)}}};this.showOrbitLineForObject=function(h,j){f.showObject(j+"_propogation",h)};this.showModelForId=function(h,j){f.showObject(j,h)};this.showAllGroundTracks=function(k){var h=f.getGraphicsObjects();for(var j in h){if(h[j].id.indexOf("_groundPoint")!=-1){f.showObject(h[j].id,k)}}};this.showGroundTrackForId=function(h,j){f.showObject(j+"_groundPoint",h)};this.showAllSensorProjections=function(k){var h=f.getGraphicsObjects();for(var j in h){if(h[j].id.indexOf("_sensorProjection")!=-1){f.showObject(h[j].id,k)}}};this.showSensorProjectionForId=function(h,j){f.showObject(j+"_sensorProjection",h)};this.showAllControlLines=function(k){e=k;var h=f.getGraphicsObjects();for(var j in h){if(h[j].id.indexOf("_controlLine")!=-1){f.showObject(h[j].id,k)}}};this.showControlLineForId=function(h,j){f.showObject(j+"_controlLine",h)};this.removeAllExceptEarthAndMoon=function(){var h=f.getGraphicsObjects();for(var j in h){if(h[j].id!="earth"&&h[j].id!="moon"){f.removeObject(h[j].id)}}};this.setup=function(){this.removeAllExceptEarthAndMoon();f.setup()};function d(h){if(h==undefined){return undefined}return{x:-h.x,y:h.z,z:h.y}}};var HarmonicTerms={calculatePerturbationTerms:function(c,b){}};var OrbitPropagator={rungeKuttaFehlbergIntegrator:function(b,p,s,e){var r=b;var A=new Array();var d=new Array();var u=0;var l=1;var y=s;var t=0.02;if(s>t){y=t}var z=e.getTime();l=p/y;var v=1;for(v=1;v<=l;v++){z=z+(y*1000);var x=new Date(z);GST=CoordinateConversionTools.convertTimeToGMST(x);var o=new Array();var n=new Array();var m=new Array();var k=new Array();var g=new Array();var c=new Array();var w=0;for(w=0;w<9;w++){d[w]=r[w]}u=y;A=this.generateStateUpdate(d,u,GST);for(w=0;w<9;w++){o[w]=y*A[w]}for(w=0;w<9;w++){d[w]=r[w]+0.25*o[w]}u=0.25*y;A=this.generateStateUpdate(d,u,GST);for(w=0;w<9;w++){n[w]=y*A[w]}for(w=0;w<9;w++){d[w]=r[w]+(3/32)*o[w]+(9/32)*n[w]}u=0.375*y;A=this.generateStateUpdate(d,u,GST);for(w=0;w<9;w++){m[w]=y*A[w]}for(w=0;w<9;w++){d[w]=r[w]+((1932/2197)*o[w])-((7200/2197)*n[w])+((7296/2197)*m[w])}u=0.9230769230769231*y;A=this.generateStateUpdate(d,u,GST);for(w=0;w<9;w++){k[w]=y*A[w]}for(w=0;w<9;w++){d[w]=r[w]+((439/216)*o[w])-(8*n[w])+((3680/513)*m[w])-((845/4104)*k[w])}u=y;A=this.generateStateUpdate(d,u,GST);for(w=0;w<9;w++){g[w]=y*A[w]}for(w=0;w<9;w++){d[w]=r[w]-((8/27)*o[w])+((2)*n[w])-((3544/2565)*m[w])+((1859/4104)*k[w])-((11/40)*g[w])}u=(0.5)*y;A=this.generateStateUpdate(d,u,GST);for(w=0;w<9;w++){c[w]=y*A[w]}for(w=0;w<9;w++){r[w]=r[w]+((16/135)*o[w])+((6656/12825)*m[w])+((28561/56430)*k[w])-((9/50)*g[w])+((2/55)*c[w])}}return r},generateStateUpdate:function(g,f,e){var b=new Array();var c=Constants.muEarth;var d=Math.sqrt((g[0]*g[0])+(g[1]*g[1])+(g[2]*g[2]));b[0]=g[3];b[1]=g[4];b[2]=g[5];b[3]=-c*g[0]/(d*d*d);b[4]=-c*g[1]/(d*d*d);b[5]=-c*g[2]/(d*d*d);b[6]=0;b[7]=0;b[8]=0;return b},propagateOrbit:function(l,s,D,k){var e=CoordinateConversionTools.convertECIToKeplerian(l);if(s==0||isNaN(e.getEccentricity())){return l}else{if(e.getEccentricity()<=0.1){var N=e.getMeanAnomaly()+e.getMeanMotion()*s;var v=MathTools.toRadians(e.getArgOfPerigee());var I=MathTools.toRadians(e.getRaan());var t=MathTools.toRadians(e.getInclination());var A=e.getEccentricity();var E=Constants.muEarth;N=MathTools.toRadians(N);var c=N*0.95;var H=0.00001;for(var J=0;J<500;J++){var b=N-(c-A*Math.sin(c));if(Math.abs(b)>H){if(b>0){c=c+Math.abs(N-c)/2}else{if(b<0){c=c-Math.abs(N-c)/2}}}else{break}}var M=2*Math.atan(Math.sqrt((1+A)/(1-A))*Math.tan(c/2));var F=e.getSemimajorAxis()*(1-A*A);var C=e.getSemimajorAxis()*(1-A*Math.cos(c));var K=Math.sqrt(E*e.getSemimajorAxis()*(1-A*A));var u=C*(Math.cos(I)*Math.cos(v+M)-Math.sin(I)*Math.sin(v+M)*Math.cos(t));var o=C*(Math.sin(I)*Math.cos(v+M)+Math.cos(I)*Math.sin(v+M)*Math.cos(t));var n=C*Math.sin(t)*Math.sin(v+M);var B=((u*K*A)/(C*F))*Math.sin(M)-(K/C)*(Math.cos(I)*Math.sin(v+M)+Math.sin(I)*Math.cos(v+M)*Math.cos(t));var G=((o*K*A)/(C*F))*Math.sin(M)-(K/C)*(Math.sin(I)*Math.sin(v+M)-Math.cos(I)*Math.cos(v+M)*Math.cos(t));var L=((n*K*A)/(C*F))*Math.sin(M)+(K/C)*(Math.sin(t)*Math.cos(v+M));var m=new ECICoordinates();m.setX(u);m.setY(o);m.setZ(n);m.setVX(B);m.setVY(G);m.setVZ(L);m.setAX(0);m.setAY(0);m.setAZ(0);return m}else{var j=new Array();j[0]=l.x;j[1]=l.y;j[2]=l.z;j[3]=l.vx;j[4]=l.vy;j[5]=l.vz;j[6]=l.ax;j[7]=l.ay;j[8]=l.az;var g=this.rungeKuttaFehlbergIntegrator(j,s,D,k);var d=new ECICoordinates(g[0],g[1],g[2],g[3],g[4],g[5],g[6],g[7],g[8]);return d}}}};var a=new Array();var i=0;for(i=0;i<3;i++){a[i]=new Array()}var Constants={radiusEarth:6378.1363,muEarth:398600.4418,eccEarthSphere:0.081819221456};var CoordinateConversionTools={convertCurrentEpochToJulianDate:function(g){var d=0;var f=g.getYear()+1900;var h=g.getMonth();var c=g.getDate();var b=g.getHours();var j=g.getMinutes();var e=g.getSeconds();d=367*f-(7*(f+((h+9)/12))/4)+(275*h/9)+(c)+1721013.5+((e/60+j)/60+b)/24;return d},convertTimeToGMST:function(e){var d=this.convertCurrentEpochToJulianDate(e);var c=(d-2451545)/36525;var b=67310.54841+(876600*3600+8640184.812866)*c+0.093104*c*c-(0.0000062)*c*c*c;var f=Math.floor(b/86400);b=b-f*86400;b=b/240;if(b<0){b=b+360}return b},convertLLAtoECEF:function(l){var k=MathTools.toRadians(l.getLatitude());var c=MathTools.toRadians(l.getLongitude());var d=Constants.radiusEarth;var o=Constants.eccEarthSphere;var e=Math.sin(k);var h=l.getAltitude();var f=d/Math.sqrt(1-o*o*e*e);var b=d*(1-o*o)/Math.sqrt(1-o*o*e*e);var n=(f+h)*(Math.cos(k)*Math.cos(c));var m=(f+h)*(Math.cos(k)*Math.sin(c));var j=(b+h)*(Math.sin(k));var g=new ECEFCoordinates(n,m,j,0,0,0,0,0,0);return g},convertECEFtoLLA:function(b){var l=new LLAcoordinates();var r=b.getX();var p=b.getY();var o=b.getZ();var m=Constants.eccEarthSphere;var t=Constants.radiusEarth;var y=Math.sqrt((r*r)+(p*p));var k=p/y;var f=r/y;var g=Math.atan(k/f);var n=g;var e=o/y;var x=Math.atan(e);var u=1e-8;var w=0;var h=x;var s=2000;var v;var d;var j=0;while(Math.abs(h-s)>u){s=h;v=Math.sin(s);w=t/Math.sqrt(1-(m*m*v*v));d=(o+w*m*m*v)/y;h=Math.atan(d);j++;if(j>500){h=0;s=0}}if(n<-Math.PI){n=n+2*Math.PI}if(n>Math.PI){n=n-2*Math.PI}l.setLatitude(MathTools.toDegrees(h));l.setLongitude(MathTools.toDegrees(n));l.setAltitude(y/Math.cos(h)-w);return l},convertECItoECEF:function(g,e){var c=new ECEFcoordinates();eciPos=new Array();eciPos[0]=g.getX();eciPos[1]=g.getY();eciPos[2]=g.getZ();var b=MathTools.rot3(e,eciPos);c.setX(b[0]);c.setY(b[1]);c.setZ(b[2]);var d=new Array();d[0]=g.getVX();d[1]=g.getVY();d[2]=g.getVZ();b=MathTools.rot3(e,d);c.setVx(b[0]);c.setVy(b[1]);c.setVz(b[2]);var f=new Array();f[0]=g.getAx();f[1]=g.getAy();f[2]=g.getAz();b=MathTools.rot3(e,f);c.setAx(b[0]);c.setAy(b[1]);c.setAz(b[2]);return c},convertECEFtoECI:function(c,e){var g=new ECICoordinates();var h=new Array();h[0]=c.getX();h[1]=c.getY();h[2]=c.getZ();var b=MathTools.rot3(-e,h);g.setX(b[0]);g.setY(b[1]);g.setZ(b[2]);var d=new Array();d[0]=c.getVX();d[1]=c.getVY();d[2]=c.getVZ();b=MathTools.rot3(-e,d);g.setVX(b[0]);g.setVY(b[1]);g.setVZ(b[2]);var f=new Array();f[0]=c.getAX();f[1]=c.getAY();f[2]=c.getAZ();b=MathTools.rot3(-e,f);g.setAX(b[0]);g.setAY(b[1]);g.setAZ(b[2]);return g},convertECItoLLA:function(d,c){var b=convertECItoECEF(d,c);return convertECEFtoLLA(b)},convertLLAtoECI:function(c,d){var b=this.convertLLAtoECEF(c);return this.convertECEFtoECI(b,d)},convertKeplerianToECI:function(d){var u=new ECIcoordinates();var n=d.getSemimajorAxis();var k=d.getEccentricity();var b=n*(1-k*k);var m=d.getTrueAnomaly();var f=Math.cos(Math.toRadians(m));var g=Math.sin(Math.toRadians(m));var t=b*f/(1+k*f);var l=b*g/(1+k*f);var h=0;var r=new Array();r[0]=t;r[1]=l;r[2]=h;var o=new Array();o=MathTools.rot3(-d.getArgOfPerigee(),r);o=MathTools.rot1(-d.getInclination(),o);o=MathTools.rot3(-d.getRaan(),o);u.setX(o[0]);u.setY(o[1]);u.setZ(o[2]);var j=-Math.sqrt(Constants.muEarth/b)*g;var c=Math.sqrt(Constants.muEarth/b)*(k+f);var s=0;r[0]=j;r[1]=c;r[2]=s;o=MathTools.rot3(-d.getArgOfPerigee(),r);o=MathTools.rot1(-d.getInclination(),o);o=MathTools.rot3(-d.getRaan(),o);u.setVx(o[0]);u.setVy(o[1]);u.setVz(o[2]);return u},convertECIToKeplerian:function(m){var H=new KeplerianCoordinates();var w=new Array();w[0]=m.x;w[1]=m.y;w[2]=m.z;var s=new Array();s[0]=m.vx;s[1]=m.vy;s[2]=m.vz;var F=MathTools.cross(w,s);var x=MathTools.magnitude(F);var d=MathTools.magnitude(w);var C=MathTools.magnitude(s);var b=new Array();b[0]=0;b[1]=0;b[2]=1;var z=new Array();z=MathTools.cross(b,F);var D=C*C-Constants.muEarth/d;var B=MathTools.dotMultiply(w,s);var J=new Array();var E=0;for(E=0;E<3;E++){J[E]=(1/Constants.muEarth)*(D*w[E]-B*s[E])}var f=MathTools.magnitude(J);var G=C*C/2-Constants.muEarth/d;var y=0;var K=0;if(f==1){K=Infinity;y=x*x/Constants.muEarth}else{K=-Constants.muEarth/(2*G);y=K*(1-f*f)}var o=MathTools.toDegrees(Math.acos(F[2]/x));var k=MathTools.toDegrees(Math.acos(z[0]/MathTools.magnitude(z)));if(z[1]<0){k=360-k}var g=MathTools.toDegrees(Math.acos(MathTools.dotMultiply(z,J)/(MathTools.magnitude(z)*f)));if(J[2]<0){g=360-g}var A=MathTools.dotMultiply(J,w)/(f*d);if(A>1){A=1}var L=MathTools.toDegrees(Math.acos(A));if(MathTools.dotMultiply(s,w)<0){L=360-L}if(isNaN(k)){k=0.00001}if(isNaN(g)){g=0.00001}H.setSemimajorAxis(K);H.setEccentricity(f);H.setTrueAnomaly(L);H.setRaan(k);H.setInclination(o);H.setMeanMotion(MathTools.toDegrees(Math.sqrt(Constants.muEarth/(K*K*K))));H.setArgOfPerigee(g);var t=Math.sin(MathTools.toRadians(L));var j=Math.cos(MathTools.toRadians(L));var u=((t*Math.sqrt(1-f*f))/(1+f*j));var l=((f+j)/(1+f*j));var c=Math.atan2(u,l);var I=c-f*u;I=MathTools.toDegrees(I);H.setMeanAnomaly(I);return H},buildRotationMatrixToConvertECItoRSW:function(f){var g=f.getKepler();var d=g.getTrueAnomaly();var b=g.getArgOfPerigee();var h=g.getInclination();var c=g.getRaan();var j=new Array(3);var e=0;for(var e=0;e<3;e++){j[e]=new Array(3)}j=MathTools.buildRotationMatrix3(c);j=MathTools.multiply(MathTools.buildRotationMatrix1(h),j);j=MathTools.multiply(MathTools.buildRotationMatrix3(b),j);j=MathTools.multiply(MathTools.buildRotationMatrix3(d),j);return j},convertTargetECIToSatelliteRSW:function(k,g){var e=new RSWcoordinates();var f=k.getKepler();var b=k.getEci();var h=f.getTrueAnomaly();var l=f.getArgOfPerigee();var c=f.getInclination();var j=f.getRaan();var d=new Array();d[0]=g.getX()-b.getX();d[1]=g.getY()-b.getY();d[2]=g.getZ()-b.getZ();d=MathTools.rot3(j,d);d=MathTools.rot1(c,d);d=MathTools.rot3(l,d);d=MathTools.rot3(h,d);e.setRadial(d[0]);e.setAlongTrack(d[1]);e.setCrossTrack(d[2]);return e},convertRSWToECI:function(h,e){var l=new ECIcoordinates();var f=h.getKepler();var g=f.getTrueAnomaly();var k=f.getArgOfPerigee();var c=f.getInclination();var j=f.getRaan();var b=new Array();b[0]=e.getRadial();b[1]=e.getAlongTrack();b[2]=e.getCrossTrack();var d=new Array();d=MathTools.rot3(-g,b);d=MathTools.rot3(-k,d);d=MathTools.rot1(-c,d);d=MathTools.rot3(-j,d);l.setX(d[0]);l.setY(d[1]);l.setZ(d[2]);return l},getSunPositionECIAtCurrentTime:function(f){var g=convertCurrentEpochToJulianDate(f);var b=(g-2451545)/36525;var c=280.4606184+36000.77005361*b;var h=357.5277233+35999.05034*b;var d=c+1.914666471*Math.sin(Math.toRadians(h))+0.019994643*Math.sin(2*Math.toRadians(h));var m=1.000140612-0.016708617*Math.cos(Math.toRadians(h))-0.000139589*Math.cos(2*Math.toRadians(h));var j=23.439291-0.0130042*b;var l=149597870;var k=new ECIcoordinates();k.setX(m*Math.cos(Math.toRadians(d))*l);k.setY(m*Math.cos(Math.toRadians(j))*Math.sin(Math.toRadians(d))*l);k.setZ(m*Math.sin(Math.toRadians(j))*Math.sin(Math.toRadians(d))*l);return k}};var CoordinateFunctionHelper={updateKeplerianAnglesUsingTrueAnomaly:function(d){var b=Math.toRadians(trueAnomaly);var e=Math.sin(b)*Math.sqrt(1-d.eccentricity*d.eccentricity)/(1+d.eccentricity*Math.cos(b));var c=(d.eccentricity+Math.cos(b))/(1+d.eccentricity*Math.cos(b));d.eccentricAnomaly=Math.toDegrees(Math.atan2(e,c));d.meanAnomaly=Math.toDegrees(Math.toRadians(d.eccentricAnomaly)-d.eccentricity*e)},setKeplerianTrueAnomaly:function(b,c){b.trueAnomaly=c;updateAnglesUsingTrueAnomaly(b)}};function ECEFCoordinates(j,g,e,h,d,b,f,c,k){this.x=j?j:0,this.y=g?g:0,this.z=e?e:0,this.vx=h?h:0,this.vy=d?d:0,this.vz=b?b:0,this.ax=f?f:0,this.ay=c?c:0,this.az=k?k:0;this.getX=function(){return this.x};this.setX=function(l){this.x=l};this.getY=function(){return this.y};this.setY=function(l){this.y=l};this.getZ=function(){return this.z};this.setZ=function(l){this.z=l};this.getVX=function(){return this.vx};this.setVX=function(l){this.vx=l};this.getVY=function(){return this.vy};this.setVY=function(l){this.vy=l};this.getVZ=function(){return this.vz};this.setVZ=function(l){this.vz=l};this.getAX=function(){return this.ax};this.setAX=function(l){this.ax=l};this.getAY=function(){return this.ay};this.setAY=function(l){this.ay=l};this.getAZ=function(){return this.az};this.setAZ=function(l){this.az=l}}function ECICoordinates(j,g,e,h,d,b,f,c,k){this.x=j?j:0,this.y=g?g:0,this.z=e?e:0,this.vx=h?h:0,this.vy=d?d:0,this.vz=b?b:0,this.ax=f?f:0,this.ay=c?c:0,this.az=k?k:0;this.getX=function(){return this.x};this.setX=function(l){this.x=l};this.getY=function(){return this.y};this.setY=function(l){this.y=l};this.getZ=function(){return this.z};this.setZ=function(l){this.z=l};this.getVX=function(){return this.vx};this.setVX=function(l){this.vx=l};this.getVY=function(){return this.vy};this.setVY=function(l){this.vy=l};this.getVZ=function(){return this.vz};this.setVZ=function(l){this.vz=l};this.getAX=function(){return this.ax};this.setAX=function(l){this.ax=l};this.getAY=function(){return this.ay};this.setAY=function(l){this.ay=l};this.getAZ=function(){return this.az};this.setAZ=function(l){this.az=l}}function KeplerianCoordinates(g,h,e,f,b,c,d,k,j){this.semimajorAxis=g?g:0,this.meanAnomaly=h?h:0,this.eccentricAnomaly=h?h:0,this.trueAnomaly=f?f:0,this.inclination=b?b:0,this.eccentricity=c?c:0,this.raan=d?d:0,this.argOfPerigee=k?k:0,this.meanMotion=j?j:0;this.getSemimajorAxis=function(){return this.semimajorAxis};this.getMeanAnomaly=function(){return this.meanAnomaly};this.getEccentricAnomaly=function(){return this.eccentricAnomaly};this.getTrueAnomaly=function(){return this.trueAnomaly};this.getInclination=function(){return this.inclination};this.getEccentricity=function(){return this.eccentricity};this.getRaan=function(){return this.raan};this.getArgOfPerigee=function(){return this.argOfPerigee};this.getMeanMotion=function(){return this.meanMotion};this.setSemimajorAxis=function(l){this.semimajorAxis=l};this.setMeanAnomaly=function(l){this.meanAnomaly=l};this.setEccentricAnomaly=function(l){this.eccentricAnomaly=l};this.setTrueAnomaly=function(l){this.trueAnomaly=l};this.setInclination=function(l){this.inclination=l};this.setEccentricity=function(l){this.eccentricity=l};this.setRaan=function(l){this.raan=l};this.setArgOfPerigee=function(l){this.argOfPerigee=l};this.setMeanMotion=function(l){this.meanMotion=l}}function LLACoordinates(c,d,b){this.latitude=c?c:0,this.longitude=d?d:0,this.altitude=b?b:0;this.getAltitude=function(){return this.altitude};this.setAltitude=function(e){this.altitude=e};this.getLatitude=function(){return this.latitude};this.setLatitude=function(e){this.latitude=e};this.getLongitude=function(){return this.longitude};this.setLongitude=function(e){this.longitude=e}}var MathTools={scalarMultiply:function(c,d){var f=c.length;var b=new Array();for(var e=0;e<f;e++){b[e]=c[e]*d}return b},dotMultiply:function(b,f){if(b.length!=f.length){return 0}else{var e=b.length;var d=0;for(var c=0;c<e;c++){d+=(b[c]*f[c])}return d}},angleBetweenTwoVectors:function(b,g){var f=0;var e=magnitude(b);var d=magnitude(g);var c=dotMultiply(b,g);f=Math.toDegrees(Math.acos(c/(e*d)));return f},magnitude:function(b){var c=0;c=Math.sqrt(b[0]*b[0]+b[1]*b[1]+b[2]*b[2]);return c},cross:function(c,d){var b=new Array();b[0]=c[1]*d[2]-d[1]*c[2];b[1]=-(c[0]*d[2]-d[0]*c[2]);b[2]=c[0]*d[1]-d[0]*c[1];return b},rot1:function(c,d){c=MathTools.toRadians(c);var b=new Array();b[0]=d[0];b[1]=Math.cos(c)*d[1]+Math.sin(c)*d[2];b[2]=-Math.sin(c)*d[1]+Math.cos(c)*d[2];return b},rot2:function(c,d){c=MathTools.toRadians(c);var b=new Array();b[0]=Math.cos(c)*d[0]-Math.sin(c)*d[2];b[1]=d[1];b[2]=Math.sin(c)*d[0]+Math.cos(c)*d[2];return b},rot3:function(c,d){c=MathTools.toRadians(c);var b=new Array();b[0]=Math.cos(c)*d[0]+Math.sin(c)*d[1];b[1]=-Math.sin(c)*d[0]+Math.cos(c)*d[1];b[2]=d[2];return b},toRadians:function(b){return b*Math.PI/180},toDegrees:function(b){return b*180/Math.PI},buildRotationMatrix1:function(c){c=Math.toRadians(c);var b=new Array();var d=0;for(d=0;d<3;d++){b[d]=new Array()}b[0][0]=1;b[0][1]=0;b[0][2]=0;b[1][0]=0;b[1][1]=Math.cos(c);b[1][2]=-Math.sin(c);b[2][0]=0;b[2][1]=Math.sin(c);b[2][2]=Math.cos(c);return b},buildRotationMatrix2:function(c){c=Math.toRadians(c);var b=new Array();var d=0;for(d=0;d<3;d++){b[d]=new Array()}b[0][0]=Math.cos(c);b[0][1]=0;b[0][2]=Math.sin(c);b[1][0]=0;b[1][1]=1;b[1][2]=0;b[2][0]=-Math.sin(c);b[2][1]=0;b[2][2]=Math.cos(c);return b},buildRotationMatrix3:function(c){c=Math.toRadians(c);var b=new Array();var d=0;for(d=0;d<3;d++){b[d]=new Array()}b[0][0]=Math.cos(c);b[0][1]=-Math.sin(c);b[0][2]=0;b[1][0]=Math.sin(c);b[1][1]=Math.cos(c);b[1][2]=0;b[2][0]=0;b[2][1]=0;b[2][2]=1;return b},ones:function(e){var b=new Array();var d=0;var c=0;for(d=0;d<e;d++){result[d]=new Array(e)}for(d=0;d<e;d++){for(c=0;c<e;c++){if(d!=c){b[d][c]=0}else{b[d][c]=1}}}return b},zeros:function(e){var b=new Array(e);var d=0;var c=0;for(d=0;d<e;d++){result[d]=new Array(e)}for(d=0;d<e;d++){for(c=0;c<e;c++){b[d][c]=0}}return b},zeros:function(f,e){var b=new Array(f);var d=0;var c=0;for(d=0;d<f;d++){result[d]=new Array(e)}for(d=0;d<f;d++){for(c=0;c<e;c++){b[d][c]=0}}return b},multiply1dBy2d:function(l,g){var b=l.length;var k=g.length;var h=g[0].length;if(b!=k){return null}var f=new Array(h);for(var e=0;e<h;e++){var c=0;for(var d=0;d<b;d++){c=c+l[d]*g[d][e]}f[e]=c}return f},multiply2dBy1d:function(l,k){var h=l.length;var e=l[0].length;var b=k.length;if(e!=b){return null}var g=new Array(h);for(var f=0;f<h;f++){var c=0;for(var d=0;d<b;d++){c=c+l[f][d]*k[d]}g[f]=c}return g},multiplyDoubleBy2d:function(e,b){var k=b.length;var f=b[0].length;var g=new Array(k);var d=0;var c=0;for(d=0;d<k;d++){g[d]=new Array(f)}for(d=0;d<k;d++){for(c=0;c<f;c++){if(b[d][c]==0){g[d][c]=0}else{g[d][c]=e*b[d][c]}}}return g},multiply2dBy2d:function(o,l){var c=o.length;var b=o[0].length;var n=l.length;var m=l[0].length;if(b!=n){return null}var h=new Array(c);var g=0;var f=0;for(g=0;g<c;g++){result[g]=new Array(m)}for(g=0;g<c;g++){for(f=0;f<m;f++){var d=0;var e=0;for(e=0;e<n;e++){d=d+o[g][e]*l[e][f]}h[g][f]=d}}return h},transposeMatrix:function(b){var e=b.length;var c=b[0].length;var g=new Array(c);var f=0;var d=0;for(f=0;f<c;f++){g[f]=new Array(e)}for(f=0;f<e;f++){for(d=0;d<c;d++){g[d][f]=b[f][d]}}return g},add1dTo1d:function(b,g){var c=b.length;var f=g.length;if(c!=f){return null}var e=new Array(c);var d=0;for(d=0;d<c;d++){e[d]=b[d]+g[d]}return e},add2dTo2d:function(l,g){var c=l.length;var b=l[0].length;var k=g.length;var h=g[0].length;if((c!=k)||(b!=h)){return null}var f=new Array(c);var e=0;var d=0;for(e=0;e<c;e++){f[e]=new Array(b)}for(e=0;e<c;e++){for(d=0;d<b;d++){f[e][d]=l[e][d]+g[e][d]}}return f},subtract2dMinus2d:function(l,g){var c=l.length;var b=l[0].length;var k=g.length;var h=g[0].length;if((c!=k)||(b!=h)){return null}var f=new Array(c);var e=0;var d=0;for(e=0;e<c;e++){f[e]=new Array(b)}for(e=0;e<c;e++){for(d=0;d<b;d++){f[e][d]=l[e][d]-g[e][d]}}return f},subtract1dMinus1d:function(b,g){var c=b.length;var f=g.length;if(c!=f){return null}var e=new Array(c);var d=0;for(d=0;d<c;d++){e[d]=b[d]-g[d]}return e}};function Quaternion(){this.w=xVal?xVal:0,this.x=xVal?xVal:0,this.y=yVal?yVal:0,this.z=zVal?zVal:0,this.q=new Array(4);this.updateQ=function(){this.q[0]=this.w;this.q[1]=this.x;this.q[2]=this.y;this.q[3]=this.z};this.getQ=function(){return q};this.setQ=function(b){this.w=b[0];this.x=b[1];this.y=b[2];this.z=b[3];this.q=b};this.getW=function(){return this.w};this.setW=function(b){this.w=b;updateQ()};this.getX=function(){return this.x};this.setX=function(b){this.x=b;updateQ()};this.getY=function(){return this.y};this.setY=function(b){this.y=b;updateQ()};this.getZ=function(){return this.z};this.setZ=function(b){this.z=b;updateQ()};this.isZero=function(){var c=true;var b=0;for(b=0;b<4;b++){if(this.q[b]!=null){if(this.q[b]!=0){c=false;break}}}return c}}var QuaternionMath={multiplyQuaternions:function(j,h){if(j.isZero()){return h}else{if(h.isZero()){return j}else{var g=j.getW();var c=j.getX();var l=j.getY();var e=j.getZ();var f=h.getW();var b=h.getX();var k=h.getY();var d=h.getZ();var m=new Quaternion();m.setW(g*f-c*b-l*k-e*d);m.setX(g*b+c*f+l*d-e*k);m.setY(g*k+l*f+e*b-c*d);m.setZ(g*d+e*f+c*k-l*b);return m}}},applyQuaternionRotation:function(j,d){var k=j.getW();var h=j.getX();var g=j.getY();var f=j.getZ();var c=new Array(3);var e=0;for(e=0;e<3;e++){c[e]=new Array(3)}c[0][0]=2*k*k-1+2*h*h;c[0][1]=2*h*g+2*k*f;c[0][2]=2*h*f-2*k*g;c[1][0]=2*h*g-2*k*f;c[1][1]=2*k*k-1+2*g*g;c[1][2]=2*g*f+2*k*h;c[2][0]=2*h*f+2*k*g;c[2][1]=2*g*f-2*k*h;c[2][2]=2*k*k-1+2*f*f;var b=MathTools.multiply(c,d);return b},getEulerAngles:function(b){var k=b.getW();var h=b.getX();var g=b.getY();var f=b.getZ();var j=Math.atan2((2*(k*h+g*f)),(1-2*(h*h+g*g)));var c=Math.asin(2*(k*g-f*h));var e=Math.atan2((2*(k*f+h*g)),(1-2*(g*g+f*f)));var d=new Array(3);d[0]=Math.toDegrees(j);d[1]=Math.toDegrees(c);d[2]=Math.toDegrees(e);return d},convertRotationMatrixToQuaternion:function(f){var c=new Quaternion();var j=f[0][0];var h=f[0][1];var g=f[0][2];var e=f[1][0];var d=f[1][1];var b=f[1][2];var n=f[2][0];var l=f[2][1];var k=f[2][2];c.setW(0.5*Math.sqrt(j+d+k+1));c.setX((b-l)/(4*c.getW()));c.setY((n-g)/(4*c.getW()));c.setZ((h-e)/(4*c.getW()));return c}};function RSWCoordinates(){radial=0,alongTrack=0,crossTrack=0}var SimulationObject={name:"",eciCoords:ECICoordinates,ecefCoords:ECEFCoordinates,keplerCoords:KeplerianCoordinates,llaCoords:LLACoordinates,sensorList:new Array(),getEcefCoordinates:function(){return ecefCoords},setEcefCoordinates:function(b){ecefCoords=b},getEciCoordinates:function(){return eciCoords},setEciCoordinates:function(b){eciCoords=b},getKeplerianCoordinates:function(){return keplerCoords},setKeplerianCoordinates:function(b){kepler=b},getLlaCoordinates:function(){return llaCoords},setLlaCoordinates:function(b){lla=b},getName:function(){return name},setName:function(b){this.name=b},getSensors:function(){return sensors},setSensors:function(b){sensorList=b},propagateState:function(g,e,c){eciCoords=OrbitPropagator.propagateOrbit(eci,g,e,c);keplerCoords=CoordinateConversionTools.convertECIToKeplerian(eci);var f=(c.getTime()+(g*1000));var b=new Date(f);var d=CoordinateConversionTools.convertTimeToGMST(b);ecefCoords=CoordinateConversionTools.convertECItoECEF(eci,d);llaCoords=CoordinateConversionTools.convertECItoLLA(eci,d)}};