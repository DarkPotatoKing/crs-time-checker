function min(){
	m = arguments[0];
	for (var i=1; i<arguments.length; i++){
		c = arguments[i];
		if (c<m) m=c;
	}
	return m;
}
function mini(){
	var i=0, m = arguments[0];
	for (j=1; j<arguments.length; j++){
		c = arguments[j];
		if (c<m) {m=c;i=j;}
	}
	return i;
}
function mink(d){
	var i,m;
	for (k in d)
		if (m==undefined || d[k]<m) {m = d[k];i=k;}
	return i;
}
function walk(from,to){
	var x1,y1,x2,y2,D=0,T=0;
	if (from instanceof point){
		x1=from.x;
		y1=from.y;
	}
	else if (from instanceof class_){
		x1=from.x;
		y1=from.y;
		D += 20 + (from.f-1)*5;
		T += 1 + (from.f-1);
	}
	else if (from instanceof bldg){
		x1=from.cx;
		y1=from.cy;
		D += 20 + (from.f-1)*5;
		T += 1 + (from.f-1);
	}
	if (to instanceof point){
		x2=to.x;
		y2=to.y;
	}
	else if (to instanceof class_){
		x2=to.x;
		y2=to.y;
		D += 20 + (to.f-1)*5;
		T += 1 + (to.f-1);
	}
	else if (to instanceof bldg){
		x2=to.cx;
		y2=to.cy;
		D += 20 + (to.f-1)*5;
		T += 1 + (to.f-1);
	}
	var pd = puredist(x1,y1,x2,y2);
	D += 10 + pd;
	T += 2 + pd*0.025;
	return new result(D,T,'w');
}
function ride(from,to,speed){
	var x1,y1,x2,y2,D=0,T=0;
	if (from instanceof point){
		x1=from.x;
		y1=from.y;
	}
	else if (from instanceof class_){
		x1=from.x;
		y1=from.y;
		D += 20 + (from.f-1)*3;
		T += 1 + (from.f-1);
	}
	else if (from instanceof bldg){
		x1=from.cx;
		y1=from.cy;
		D += 20 + (from.f-1)*3;
		T += 1 + (from.f-1);
	}
	if (to instanceof point){
		x2=to.x;
		y2=to.y;
	}
	else if (to instanceof class_){
		x2=to.x;
		y2=to.y;
		D += 20 + (to.f-1)*3;
		T += 1 + (to.f-1);
	}
	else if (to instanceof bldg){
		x2=to.cx;
		y2=to.cy;
		D += 20 + (to.f-1)*3;
		T += 1 + (to.f-1);
	}
	var pd = puredist(x1,y1,x2,y2);
	var	s, fc;
	for (i in MAP.c){
		var c=MAP.c[i], cd=puredist(x1,y1,c.x,c.y);
		if (cd < s || s == undefined) {s = cd; fc = i;}
	}
	var X = Math.abs(MAP.c[fc].x-x1), Y = Math.abs(MAP.c[fc].y-y1), S = (X<Y?X:Y);
	D += S; T += S*0.05+0.25;
	
	s = undefined;
	var tc;
	for (i in MAP.c){
		var c=MAP.c[i], cd=puredist(x2,y2,c.x,c.y);
		if (cd < s || s==undefined) {s = cd; tc = i;}
	}
	var X = Math.abs(MAP.c[tc].x-x2), Y = Math.abs(MAP.c[tc].y-y2), S = (X<Y?X:Y);
	D += S; T += S+0.25;
	
	var dists={},dist;
	for (i in MAP.j){
		dist=0;
		var cur = MAP.j[i], start = cur.c.indexOf(fc), c=fc, c_=cur.c[start+1];
		for (j=start; c!=tc;){
			if (MAP.r[c+c_]) dist+=MAP.r[c+c_].d+0.25;
			else             dist+=MAP.r[c_+c].d+0.25;
			j=(j+1)%(cur.c.length-1);
			c = cur.c[j];
			c_ = cur.c[j+1];
			if (c==fc) break;
		}
		dists[i]=dist;
	}
	m = mink(dists);
	if      (speed==0) T += dists[m]*0.1 + 2;
	else if (speed==1) T += dists[m]*0.05 + 1;
	else if (speed==2) T += dists[m]*0.025 + 0.5;
	else if (speed==3) T += dists[m]*0.01 + 0.25;
	D += dists[m];
	
	return new result(D,T,m);
}
function optimal(from, to){
	walkres = walk(from,to);
	if (walkres.d < 100 && walkres.t < 15) return walkres;
	else return ride(from,to,2);
}
