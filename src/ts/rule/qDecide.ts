module Rule {
  export class QDecider<S, T> {
    howGetTypes :(a :S)=>T[]
    howSetTypes :(a :S, b :T[])=>void
    howGetTypeVolume :(a :T)=>number
    typesAll :T[]
    members :S[]

    constructor(members :S[], types :T[], getTypes :(a :S)=>T[], setTypes: (a :S, b :T[])=>void, getTypeVolume :(a :T)=>number) {
      this.members = members;
      this.typesAll = types;
      this.howGetTypes = getTypes;
      this.howSetTypes = setTypes;
      this.howGetTypeVolume = getTypeVolume;
    }

    updateFilled() {
      var checkTarget = this.typesAll;

      var that = this;
      var combination = fullCombination(checkTarget);
      combination.forEach(function(condition :T[]) {
        var hitMember :S[] = [];
        that.members.forEach(function(member :S) {
          if (containsAll(condition, that.howGetTypes(member))) {
            hitMember.push(member);
          }
        });

        var sumVolume = condition.map(that.howGetTypeVolume).reduce(function(prev, current) {
          return prev + current;
        });
        if (hitMember.length == sumVolume) {
          // 全タイプを、関係者以外から除外
          condition.forEach(function(type :T) {
            that.members.forEach(function(member) {
              if (! contains(hitMember, member)) {
                var newTypes = remove(that.howGetTypes(member), type);
                that.howSetTypes(member, newTypes);
              }
            });
          });
        }
      });
    }
  }

  export function remove<T>(mom :T[], dd :T, comparator :(a, b)=>boolean = null) :T[] {
    if (comparator == null) {
      comparator = function(a, b) { return a == b; };
    }

    return mom.filter(function(item) { return ! comparator(item, dd); });
  }
  export function contains<T>(mom :T[], child :T) {
    return mom.indexOf(child) >= 0;
  }
  export function containsAll<T>(mon :T[], children: T[]) :boolean {
    if (children.some(function(child) {
      return ! contains(mon, child);
    })) {
      return false;
    }
    return true;
  }
  export function fullCombination<T>(seed :T[]) :T[][] {
    function buildCombination(head, tail, size) :T[][] {
      var ret :T[][] = [];
      for (var i = head; i <= tail - size; i ++) {
        if (size != 1) {
          buildCombination(i + 1, tail, size - 1).forEach(function(ls :T[]) {
            var element :T[] = [seed[i]];
            ls.forEach(function(lse :T) {
              element.push(lse);
            });
            ret.push(element)
          });
        } else {
          ret.push([seed[i]]);
        }
      }
      return ret;
    }

    var ret :T[][] = [];
    for (var size = 1; size <= seed.length; size ++) {
      buildCombination(0, seed.length, size).forEach(function(element) {
        ret.push(element);
      });
    }
    return ret;
  }
}
